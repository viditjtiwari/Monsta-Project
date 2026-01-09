const subCategoryModal = require("../../Models/subCategory");
const subSubCategoryModal = require("../../Models/subSubCategory");
const env = require('dotenv').config();
var slugify = require('slugify');

const generateUniqueSlug = async (Model, baseSlug) => {
    let slug = baseSlug;
    let count = 0;

    // Loop to find unique slug
    while (await Model.findOne({ slug })) {
        count++;
        slug = `${baseSlug}-${count}`;
    }

    return slug;
};

exports.viewSubCategory = async (request, response) => {

    try {

        const addCondition = [
            {
                deleted_at: null,

            }
        ];

        const orCondition = [
            {
                status: true,
            }
        ];

        if (request.body) {
            if (request.body.id != undefined) {
                if (request.body.id != '') {
                    orCondition.push({ _id: request.body.id })
                }
            }

            if (request.body.parent_category != undefined) {
                if (request.body.parent_category != '') {
                    addCondition.push({ parent_category: request.body.parent_category })
                }
            }
        }


        if (addCondition.length > 0) {
            var filter = { $and: addCondition }
        } else {
            var filter = {}
        }

        if (orCondition.length > 0) {
            filter.$or = orCondition;
        }

        await subCategoryModal.find(filter).select("name parent_category").sort({ _id: "desc" })
            .then((result) => {
                if (result.length > 0) {

                    const data = {
                        status: true,
                        message: "Record Found Successfully",
                        data: result
                    }
                    response.send(data);
                }
                else {
                    const data = {
                        status: false,
                        message: "No Record Found",
                        data: result
                    }
                    response.send(data)
                }

            })
            .catch((error) => {

                const data = {
                    status: false,
                    message: "Something went wrong",
                    error: error,
                    data: []
                }
                response.send(data);
            });

    } catch (error) {
        const data = {
            status: false,
            message: "Something went wrong",
            error: error,
            data: []
        }
        response.send(data);
    }
}

exports.create = async (request, response) => {

    //Parameter till now {name : required, order}

    var data = request.body;

    if (request.body.name) {
        slug = slugify(request.body.name, {
            lower: true,
            strict: true
        });

        data.slug = await generateUniqueSlug(subSubCategoryModal, slug);
    }

    if (request.file) {
        data.image = request.file.filename;
    }

    try {

        var saveData = new subSubCategoryModal(data).save()
            .then(async(result) => {

                await subCategoryModal.updateOne({ title: 'Casino Royale' }, { $push: { fans: { $each: [fan1._id] } } });

                const data = {
                    status: true,
                    message: "Record Created Successfully",
                    data: result
                }
                response.send(data);
            })
            .catch((error) => {
                var errors = [];

                for (var i in error.errors) {
                    errors.push(error.errors[i].message);
                }

                const data = {
                    status: false,
                    message: "Something went wrong",
                    error: errors,
                    data: null
                }
                response.send(data);
            });

    } catch (error) {
        const data = {
            status: false,
            message: "Something went wrong",
            error: error,
            data: null
        }
        response.send(data);
    }
}

exports.view = async (request, response) => {

    //Parameter till now {name ,page, limit}

    var current_page = 1;
    var total_pages = 0;
    var total_records = 0
    var limit = 10
    var skip = 0

    if (request.body) {
        if (request.body.limit != '' && request.body.limit != undefined && request.body.limit > 0) {
            limit = parseInt(request.body.limit);
        }

        if (request.body.page != '' && request.body.page != undefined && request.body.page > 0) {
            skip = (request.body.page - 1) * limit;
            current_page = parseInt(request.body.page);
        }
    }


    try {

        const addCondition = [
            {
                deleted_at: null,
            }
        ];

        const orCondition = [];

        if (request.body) {
            if (request.body.name != undefined) {
                if (request.body.name != '') {
                    var name = new RegExp(request.body.name, "i")
                    addCondition.push({ name: name })
                }
            }
            if (request.body.parent_category != undefined) {
                if (request.body.parent_category != '') {
                    addCondition.push({ parent_category: request.body.parent_category })
                }
            }
            if (request.body.sub_category != undefined) {
                if (request.body.sub_category != '') {
                    addCondition.push({ sub_category: request.body.sub_category })
                }
            }
        }


        if (addCondition.length > 0) {
            var filter = { $and: addCondition }
        } else {
            var filter = {}
        }

        if (orCondition.length > 0) {
            filter.$or = orCondition;
        }

        total_records = await subSubCategoryModal.find(filter).countDocuments()

        await subSubCategoryModal.find(filter).select("name sub_category parent_category image status order").skip(skip).limit(limit).sort({ _id: "desc" }).populate('parent_category', 'name').populate('sub_category', 'name') //For Website this would be .sort({order: "asc", _id: "desc"})
            .then((result) => {
                if (result.length > 0) {
                    var paginate = {
                        current_page: current_page,
                        total_pages: Math.ceil(total_records / limit),
                        total_records: total_records
                    }

                    const data = {
                        status: true,
                        message: "Record Found Successfully",
                        paginate: paginate,
                        image_path: process.env.category_image_path,
                        data: result
                    }
                    response.send(data);
                }
                else {
                    const data = {
                        status: false,
                        message: "No Record Found",
                        data: result
                    }
                    response.send(data)
                }

            })
            .catch((error) => {

                const data = {
                    status: false,
                    message: "Something went wrong",
                    error: error,
                    data: []
                }
                response.send(data);
            });

    } catch (error) {
        const data = {
            status: false,
            message: "Something went wrong",
            error: error,
            data: []
        }
        response.send(data);
    }
}

exports.details = async (request, response) => {
    try {

        await subSubCategoryModal.findById(request.params.id)
            .then((result) => {
                if (result) {

                    const data = {
                        status: true,
                        message: "Record Found Successfully",
                        image_path: process.env.category_image_path,
                        data: result
                    }
                    response.send(data);
                }
                else {
                    const data = {
                        status: false,
                        message: "No Record Found",
                        data: result
                    }
                    response.send(data);
                }

            })
            .catch((error) => {

                const data = {
                    status: false,
                    message: "Something went wrong",
                    error: error,
                    data: null
                }
                response.send(data);
            });

    } catch (error) {
        const data = {
            status: false,
            message: "Something went wrong",
            error: error,
            data: null
        }
        response.send(data);
    }
}

exports.update = async (request, response) => {
    try {

        var data = request.body;
        data.updated_at = Date.now()

        if (request.body.name) {
            slug = slugify(request.body.name, {
                lower: true,
                strict: true
            });

            data.slug = await generateUniqueSlug(subSubCategoryModal, slug);
        }

        if (request.file != undefined) {
            if (request.file) {
                data.image = request.file.filename;
            }
        }

        var saveData = await subSubCategoryModal.updateOne({
            _id: request.params.id
        }, {
            $set: data
        })
            .then((result) => {
                if (result.matchedCount > 0) {
                    const data = {
                        status: true,
                        message: "Record Updated Successfully",
                        data: result
                    }
                    response.send(data);
                }
                else {
                    const data = {
                        status: false,
                        message: "Record Does Not Exists",
                        data: result
                    }
                    response.send(data);
                }

            })
            .catch((error) => {
                var errors = [];

                for (var i in error.errors) {
                    errors.push(error.errors[i].message);
                }

                const data = {
                    status: false,
                    message: "Something went wrong",
                    error: errors,
                    data: null
                }
                response.send(data);
            });

    } catch (error) {
        const data = {
            status: false,
            message: "Something went wrong",
            error: error,
            data: null
        }
        response.send(data);
    }
}

exports.destroy = async (request, response) => {
    try {

        var data = {
            deleted_at: Date.now()
        }

        var saveData = await subSubCategoryModal.updateMany({
            _id: request.body.ids
        }, {
            $set: data
        })
            .then((result) => {
                if (result.matchedCount == 1) {
                    const data = {
                        status: true,
                        message: "Record Deleted Successfully",
                        data: result
                    }
                    response.send(data);
                }
                else {
                    const data = {
                        status: false,
                        message: "Record Does Not Exists",
                        data: result
                    }
                    response.send(data);
                }

            })
            .catch((error) => {
                var errors = [];

                for (var i in error.errors) {
                    errors.push(error.errors[i].message);
                }

                const data = {
                    status: false,
                    message: "Something went wrong",
                    error: errors,
                    data: null
                }
                response.send(data);
            });

    } catch (error) {
        const data = {
            status: false,
            message: "Something went wrong",
            error: error,
            data: null
        }
        response.send(data);
    }
}

exports.changeStatus = async (request, response) => {
    try {

        var saveData = await subSubCategoryModal.updateMany({
            _id: request.body.ids
        }, [{
            $set: {
                status: {
                    $not: "$status"
                }
            }
        }])
            .then((result) => {
                if (result.matchedCount > 0) {
                    const data = {
                        status: true,
                        message: "Status Changed Successfully",
                        data: result
                    }
                    response.send(data);
                }
                else {
                    const data = {
                        status: false,
                        message: "Record Does Not Exists",
                        data: result
                    }
                    response.send(data);
                }

            })
            .catch((error) => {
                var errors = [];

                for (var i in error.errors) {
                    errors.push(error.errors[i].message);
                }

                const data = {
                    status: false,
                    message: "Something went wrong",
                    error: errors,
                    data: null
                }
                response.send(data);
            });

    } catch (error) {
        const data = {
            status: false,
            message: "Something went wrong",
            error: error,
            data: null
        }
        response.send(data);
    }
}
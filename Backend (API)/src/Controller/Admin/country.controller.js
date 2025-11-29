const countryModal = require("../../Models/country");
const env = require('dotenv').config();

exports.create = (request, response) => {

    //Parameter till now {name : required, order}

    var data = request.body;

    try {

        var saveData = new countryModal(data).save()
            .then((result) => {
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
                name: { $exists: true }
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
        }


        if (addCondition.length > 0) {
            var filter = { $and: addCondition }
        } else {
            var filter = {}
        }

        if (orCondition.length > 0) {
            filter.$or = orCondition;
        }

        total_records = await countryModal.find(filter).countDocuments()

        await countryModal.find(filter).select("name status order").skip(skip).limit(limit).sort({ _id: "desc" }) //For Website this would be .sort({order: "asc", _id: "desc"})
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

        await countryModal.findById(request.params.id)
            .then((result) => {
                if (result) {
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

        var saveData = await countryModal.updateOne({
            _id: request.params.id
        }, {
            $set: data
        })
            .then((result) => {
                if (result.matchedCount == 1) {
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

        var saveData = await countryModal.updateMany({
            _id: request.body.ids
        }, {
            $set: data
        })
            .then((result) => {
                if (result.matchedCount > 0) {
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

exports.changeStatus = async(request, response) => {
    try {

        var saveData = await countryModal.updateMany({
            _id: request.body.ids
        }, [{
            $set: {
                status : {
                    $not : "$status"
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
import userServices from '../services/userServices';
require('dotenv').config();

let handleLoginUser = async (req, res) => {
    try {
        let email = req.body.email
        let password = req.body.password
        if (email && password) {
            let response = await userServices.loginUser(email, password)

            res.cookie("accessToken", response.data.accessToken, { httpOnly: true, maxAge: process.env.COOKIE_EXPIRE_TIME });
            res.cookie("refreshToken", response.data.refreshToken, { httpOnly: true, maxAge: process.env.COOKIE_EXPIRE_TIME });

            return res.status(response.status).json({
                errorCode: response.errorCode,
                errorMessage: response.errorMessage,
                data: response.data
            })
        } else {
            return res.status(500).json({
                errorCode: 1,
                errorMessage: "Missing email or password",
                data: ""
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errorCode: 1,
            errorMessage: 'Error from server',
        })
    }
}

let handleRegisterUser = async (req, res) => {
    try {
        let data = {
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            gender: req.body.gender,
            groupId: req.body.groupId
        }

        if (data) {
            let response = await userServices.registerUser(data)
            return res.status(response.status).json({
                errorCode: response.errorCode,
                errorMessage: response.errorMessage,
                data: response.data
            })
        } else {
            return res.status(500).json({
                errorCode: 1,
                errorMessage: "Missing required parameter",
                data: ""
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errorCode: 1,
            errorMessage: 'Error from server',
        })
    }
}

let handleGetAllUsers = async (req, res) => {
    try {
        let { page, limit } = req.query

        // check if pagination 
        if (page && limit) {
            let paginationUsers = await userServices.paginationUserList(+page, +limit)
            return res.status(paginationUsers.status).json({
                errorCode: paginationUsers.errorCode,
                errorMessage: paginationUsers.errorMessage,
                data: paginationUsers.data
            })
        } else {
            // let users = await userServices.getAllUsers()
            // return res.status(users.status).json({
            //     errorCode: users.errorCode,
            //     errorMessage: users.errorMessage,
            //     data: users.data
            // })
            return res.status(500).json({
                errorCode: 1,
                errorMessage: "Missing required parameters",
                data: ""
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errorCode: 1,
            errorMessage: 'Error from server',
        })
    }
}

let handleGetUserById = async (req, res) => {
    try {
        // let id = req.params.id
        let id = req.query.id

        if (id) {
            let user = await userServices.getUserById(id)
            return res.status(user.status).json({
                errorCode: user.errorCode,
                errorMessage: user.errorMessage,
                data: user.data
            })
        } else {
            return res.status(500).json({
                errorCode: 1,
                errorMessage: "Missing required parameter",
                data: ""
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errorCode: 1,
            errorMessage: 'Error from server',
        })
    }
}

let handleCreateUser = async (req, res) => {
    try {
        let data = {
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            gender: req.body.gender,
            groupId: req.body.groupId
        }

        if (data) {
            let response = await userServices.createUser(data)
            return res.status(response.status).json({
                errorCode: response.errorCode,
                errorMessage: response.errorMessage,
                data: response.data
            })
        } else {
            return res.status(500).json({
                errorCode: 1,
                errorMessage: "Missing required parameter",
                data: ""
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errorCode: 1,
            errorMessage: 'Error from server',
        })
    }
}

let handleDeleteUser = async (req, res) => {
    try {
        let id = req.query.id
        if (id) {
            let response = await userServices.deleteUser(id)
            return res.status(response.status).json({
                errorCode: response.errorCode,
                errorMessage: response.errorMessage,
                data: response.data
            })
        } else {
            return res.status(500).json({
                errorCode: 1,
                errorMessage: "Missing required parameter",
                data: ""
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errorCode: 1,
            errorMessage: 'Error from server',
        })
    }
}

let handleUpdateUser = async (req, res) => {
    try {
        let data = req.body
        let response = await userServices.updateUser(data)
        return res.status(response.status).json({
            errorCode: response.errorCode,
            errorMessage: response.errorMessage,
            data: response.data
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errorCode: 1,
            errorMessage: 'Error from server',
        })
    }
}

let handleGetUserRefresh = async (req, res) => {
    try {
        if (req.user) {
            let user = req.user.user
            return res.status(200).json({
                errorCode: 0,
                errorMessage: 'refresh user successfully',
                data: {
                    user: user,
                    isAuthenticated: true
                }
            })
        } else {
            return res.status(500).json({
                errorCode: 2,
                errorMessage: 'Please login to continue',
                data: ""
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errorCode: 1,
            errorMessage: 'Error from server',
        })
    }
}

let handleLogoutUser = async (req, res) => {
    try {
        setTimeout(() => {


            let cookies = req.cookies
            if (cookies && cookies.accessToken && cookies.refreshToken) {
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                return res.status(200).json({
                    errorCode: 0,
                    errorMessage: "Logout successfully",
                    data: ""
                })
            } else {
                return res.status(500).json({
                    errorCode: 1,
                    errorMessage: `Don't have user to logout`,
                    data: ""
                })
            }

        }, 5000)


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errorCode: 1,
            errorMessage: 'Error from server',
        })
    }
}

module.exports = {
    handleLoginUser: handleLoginUser,
    handleRegisterUser: handleRegisterUser,
    handleGetAllUsers: handleGetAllUsers,
    handleGetUserById: handleGetUserById,
    handleCreateUser: handleCreateUser,
    handleDeleteUser: handleDeleteUser,
    handleUpdateUser: handleUpdateUser,
    handleGetUserRefresh: handleGetUserRefresh,
    handleLogoutUser: handleLogoutUser,
}
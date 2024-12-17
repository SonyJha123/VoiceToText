import userQueryModel from "../model/user-queryModel.js";



export const createUserQuery = async (req, res,) => {
    try {
        
        const {userQuery, userId} = req.body;

        if (!userQuery||!userId) {
            return res.status(400).json({ message: 'Invalid payload' });
        }
        let userquery = await userQueryModel.create({userQuery ,userId});
      
        return res.status(201).json({ message: 'userQuery created successfully', userquery });

    } catch (error) {
        return res.status(400).json({ message: "error"})
    }
};


export const getAllUserQuery = async (req, res) => {
    try {
       let userquery = await userQueryModel.find()
        return res.status(200).json({ userquery})
    } catch (error) {
        return res.status(400).json({ message: "error"})
    }
};


export const getUserQueryById = async (req, res) => {
    try {
        const QueryId = req.params.id
        if (!QueryId) {
            return res.status(400).json({ message: 'UserQuery Id is required'})

        }
        let userquery = await userQueryModel.findById(QueryId)
        return res.status(200).json({userquery})
    } catch (error) {
        return res.status(400).json({ message: "error"})
    }
};


export const getUserQueryByUserId = async (req, res, ) => {
    
    try {
        const userId = req.params.id;
        
        if (!userId) {
            return res.status(400).json({ message: 'user Id is required' })

        }
        let userQuery = await userQueryModel.find( {userId} );

        return res.status(200).json({userQuery})
    } catch (error) {
        return res.status(400).json({ message: "error"})
    }

}



export const deleteUserQuery = async (req, res, ) => {
    try {
        const QueryId = req.params.id

        const userquery = await userQueryModel.findById(QueryId)

        if (!QueryId) {
            return res.status(400).json({ message: "userQuery not found" })
        }

        await userQueryModel.findByIdAndDelete(QueryId)
        return res.status(200).json({ message: "Deleted successfully" })
    } catch (error) {
        return res.status(400).json({ message: "error"})
    }
};

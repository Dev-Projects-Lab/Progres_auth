const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const HttpError = require("../models/http-error");
const User = require("../models/user");
const jwt = require("jsonwebtoken")
require("dotenv").config();


const getUsers = async (request, response, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        const error = new HttpError(
            "Impossible de recuperer tous les utilisateurs...",
            500
        );
        return next(error);
    }
    response.json({
        message:"Listes des Utilisateur recupérées avec succès !!",
        users: users.map((user) => user.toObject({ getters: true }))
    });
};

const modifyPwd = async (request, response, next) => {
    const { email, password } = request.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
            .then((user) => {
                user.password = password;
                user.save();
            });
    } catch (err) {
        const error = new HttpError(
            "Cette e-mail ne correspond à aucun utilisateur !",
            500
        );
        return next(error);
    }
    response.status(201).json({
        message : `Félicitation, votre mot de passe est réinitialisé !!`,
        user: existingUser
    });
}

const signup = async (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const { username, email, password, profile } = request.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            "Signing up failed, please try again later.",
            500
        );
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
            "Cette utilisateur existe dejà, veuillez choisir un autre !!",
            422
        );
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError(
            'Could not create user, please try again.',
            500
        );
        return next(error);
    }
    const createdUser = new User({
        username,
        email,
        password: hashedPassword,
        profile
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            "Inscription échouée, veuillez réessayer s'il vous plait !!",
            500
        );
        return next(error);
    }
    let token;
    try {
        token = jwt.sign(
            { userId: createdUser._id, email: createdUser.email },
                process.env.KEY_JW_TOKEN,
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }
    response.status(201).json({
        message : "Utilisateur créée avec succès !!",
        user: { userId: createdUser._id, email: createdUser.email },
        token: token
    });
};


const login = async (request, response, next) => {

    const { email, password } = request.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            "Connection échouée, veuillez réessayer s'il vous plait !!",
            500
        );
        return next(error);
    }



    if (!existingUser) {
        const error = new HttpError(
            "Vous vous connecté avec un utilisateur qui n'existe pas, veuillez réessayer s'il vous plait !!",
            401
        );
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError(
            "Impossible de vous connecter, veuillez verifier votre mot de passe ou votre nom d'utilisateur ... ",
            500
        );
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError(
            "Votre mot de passe semble incorrecte, veuillez verifier tous les informations !!",
            401
        );
        return next(error);
    }
    let token;
    try {
        token = jwt.sign(
            { userId: existingUser._id, email: existingUser.email },
           process.env.KEY_JW_TOKEN,
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }

    response.json({
        message: "Félicitation, vous êtes connecté !!",
        user: {
            userId: existingUser._id,
            email: existingUser.email,
            token: token
        }
    });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.modifyPwd = modifyPwd;
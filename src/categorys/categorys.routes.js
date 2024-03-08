import { Router } from "express";
import { check } from "express-validator";
import { getUsers, createUser, updateUser, deleteUser } from "./user.controller.js";
import { existenteEmail, esRoleValido, existeUsuarioById } from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { hasRole } from "../middlewares/validar-roles.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getUsers);

router.post(
  "/",
  [
    check("firstName", "The firstName is required").not().isEmpty(),
    check("lastName", "The lastName is required").not().isEmpty(),
    check("userName", "The userName is required").not().isEmpty(),
    check("password", "The password must be greater than 5 characters").isLength({ min: 5,}),
    check("email", "This is not a valid email").isEmail(),
    check("email").custom(existenteEmail),
    check("role").custom(esRoleValido),
    validarCampos,
  ],
  createUser
);

router.put(
  "/:id",
  [
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarJWT,
    validarCampos,
  ],
  updateUser
);

router.delete(
  "/:id",
  [
    validarJWT,
    hasRole("USER_ADMIN", "USER_CLIENT"),
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarCampos,
  ],
  deleteUser
);

export default router;
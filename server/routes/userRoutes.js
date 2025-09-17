import usersCtrl from "../controllers/usersCtrl";
const router = express.Router();

router.post("/register", usersCtrl.register);
router.post("/auth", usersCtrl.auth);
router.put("/:id", usersCtrl.updateUser);
router.delete("/:id", usersCtrl.deleteUser);
router.get("/get-all", usersCtrl.getAllUsers);
router.get("/me", usersCtrl.getUserProfile);

export default router;

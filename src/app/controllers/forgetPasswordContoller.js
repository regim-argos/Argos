import UserServices from '../Services/UserServices';

class ForgetPasswordController {
  async store(req, res) {
    const {
      body: { email },
    } = req;
    await UserServices.createForgetPasswordHash(email);
    return res.status(204).json();
  }

  async update(req, res) {
    const {
      params: { hash },
    } = req;
    await UserServices.forgetPassword(hash, req.body);
    return res.status(204).json();
  }
}

export default new ForgetPasswordController();

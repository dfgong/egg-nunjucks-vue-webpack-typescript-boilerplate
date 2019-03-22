import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    const result = ctx.service.home.getData();
    await ctx.render('page/home/home.html', {data: result});
  }
}

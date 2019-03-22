import { Service } from 'egg';

/**
 * Test Service
 */
export default class Test extends Service {

  /**
   * getData to you
   * @param name - your name
   */
  public getData() {
    return {name: "gongdf22234"};
  }
}

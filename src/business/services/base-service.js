import DbContext from "../../dal";
export default class BaseService {
  constructor() {
    this.dbContext = new DbContext();
  }
}

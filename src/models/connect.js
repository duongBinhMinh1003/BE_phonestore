import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('db_phonestore', 'root', '1234', {
  host: 'localhost',
  port: '3307',
  dialect: 'mysql', 
});
try {
      sequelize.authenticate()
      console.log("OK")
 } catch (error) {
       console.log(error)
  
   }
export default sequelize;

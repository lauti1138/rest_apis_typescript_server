import server , {connectDB} from "../server";
import db from "../config/db";

// resumen del mock
// creamos un mock e importamos la configuracion y la instancia de sequelize
jest.mock('../config/db')

describe('connectDB', () => {
    it('should handle database connection error', async () => {
        // creamos un espia, el cual espera hasta que se ejecute db. authenticate
        jest.spyOn(db, 'authenticate').mockRejectedValueOnce(new Error('Hubo un error al conectar a la BD'))
        //como quiero probar el patch, lo que hago es negar la promesa, para que pueda caer en le excepcion 
        
        // luego de esto tenemos un segundo espia para poder comprobar el mensaje
        const consoleSpy = jest.spyOn(console, 'log')

        // despues que tenemos esos espias lo que hace es llama la coneccion
        await connectDB()

        // esperamos que el espia de la consola tenga un mismo log
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Hubo un error al conectar a la BD')
        )
    })
})


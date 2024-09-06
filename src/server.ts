import express from 'express'
import colors from 'colors'
import cors, {CorsOptions} from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, {swaggerUiOptions} from './config/swagger'
import router from './router'
import db from './config/db'


// Conectar a base de datos
export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        // console.log(colors.bgGreen.blue('Conexion exitosa a la BD'))
    }

    catch (error) {

        console.log(colors.bgRed.white('Hubo un error al conectar a la BD'))
    }
}

connectDB()

// Instancia de express
const server = express()

// permitir conexiones 
const corsOptions : CorsOptions= {
    origin: function(origin, callback) {
        if(origin ===  process.env.FRONTEND_URL) {
            // primer parametro del callback es un error, en este caso no hay error porque lo estramos permitiendo
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}

server.use(cors(corsOptions))

// Leer datos de formularios
server.use(express.json())

server.use(morgan('dev'))

server.use('/api/products', router)

// Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server
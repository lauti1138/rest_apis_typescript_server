import {Request, Response} from 'express'
import Product from '../models/Product.model'

export const getProducts = async (req: Request, res: Response) => {

    const products = await Product.findAll({
        order: [
            ['id', 'DESC']
        ]

    })
    res.json({data: products})
    // try { // esto no es necesario de probar, porque es muy poco probable que utilicemos el catch
    //     const products = await Product.findAll({
    //         order: [
    //             ['price', 'DESC']
    //         ]

    //     })
    //     res.json({data: products})
    // } catch (error) {
    //     console.log(error)
    // }
}

export const getProductById = async (req: Request, res: Response) => {
        // como nombres la variable del routing dinamico es como vamos a acceder en req.params
        const {id} = req.params
        const product = await Product.findByPk(id)

        if(!product){
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }
        
        res.json({data: product})
}

export const createProduct = async (req : Request, res : Response) => {
    
        // primera manera
        // const product = new Product(req.body)
        // const savedProduct = await product.save()
    
        // segunda manera - mas eficiente
        const product = await Product.create(req.body)
    
        res.status(201).json({data: product})
}

export const updatedProduct = async (req: Request, res: Response) => {
    const { id } = req.params

     const product = await Product.findByPk(id)

     if(!product) {
        return res.status(404).json({
            error: 'Producto No Encontrado'
        })
     }

     // actualizar
     await product.update(req.body)
     await product.save()
     res.json({data: product})
}

export const updateAvailability = async (req: Request, res: Response) => {
    const { id } = req.params
    const product = await Product.findByPk(id)

     if(!product) {
        return res.status(404).json({
            error: 'Producto No Encontrado'
        })
     }

     // actualizar
    //  product.availability = req.body.availability // de esta forma tenemos que cambiar manualmente el true or false
    product.availability = !product.dataValues.availability // con esta forma cambia automaticamente cada vez que realizamos la peticion, al valor contrario
     await product.save()
     res.json({data: product})
}

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    const product = await Product.findByPk(id)

     if(!product) {
        return res.status(404).json({
            error: 'Producto No Encontrado'
        })
     }

     // de esta forma se borra de la base de datos
     // pero en algunas situaciones esta prohibido borrar informacion por lo que
     // se utilizaria un eliminado logico, es decir darle un estado visible o invisible
     // con un valor booleano en este caso no lo usamos pero es una opcion muy comun y util
     await product.destroy()
     res.json({data: 'Producto Eliminado'})

    }
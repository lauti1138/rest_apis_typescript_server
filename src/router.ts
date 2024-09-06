import { Router } from 'express'
import { body, param } from 'express-validator'
import { createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updatedProduct } from './handlers/products'
import { handleInputErrors } from './middleware'

const router= Router()

/**
 * @swagger
 * components: 
 *      schemas:
 *          Product:
 *              type: object
 *              properties: 
 *                  id:
 *                      type: integer
 *                      description: The Product ID
 *                      example: 1
 *                  name:  
 *                      type: string
 *                      description: The Product name
 *                      example: Monitor Curvo de 49 Pulgadas
 *                  price:
 *                      type: number
 *                      description: The Product price
 *                      example: 300
 *                  availability:
 *                      type: boolean
 *                      description: The Product availability
 *                      example: true
 * 
 */

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses:
 *              200:
 *                  description: Succesful response
 *                  content:
 *                      application/json:                         
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Product'                       
 * 
 */

// Routing
// req es lo que envias (datos de formularios, api key)
// res es lo que obtenes cuando envias ese request, la respuesta de que estas visitando una pagina
router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *      get:
 *          summary: Get a product by ID
 *          tags:
 *              - Products
 *          description: Return a product based on its unique ID
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Succesful Response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              404:
 *                  description: Not found
 *              400:
 *                  description: Bad Request - Invalid ID
 * 
 */

// el /:id sirve para volver dinamico el router 
router.get('/:id',   
    param('id').isInt().withMessage('ID no valido'),
    handleInputErrors,
    getProductById)

/**
 * @swagger
 * /api/products:
 *      post:
 *          summary: Create a new Product
 *          tags:
 *              - Products
 *          description: Returns a new record in the database
 *          requestBody:        
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: "Monitor Curvo 49 Pulgadas"
 *                              price:
 *                                  type: number
 *                                  example: 399
 *          responses:
 *              201:
 *                  description: Succesfull response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              400:
 *                  description: Bad Request - Invalid input data
 * 
 * 
 */

router.post('/', 
    // validacion en el router, en lugar del product
    body('name')
            .notEmpty().withMessage('El nombre del Producto no puede ir vacio'),
    body('price')
            .isNumeric().withMessage('Valor no valido')
            .notEmpty().withMessage('El precio del Producto no puede ir vacio')
            .custom((value) => value>0).withMessage('Precio no valido'),
    handleInputErrors,
    createProduct)

/**
 * @swagger
 * /api/products/{id}:
 *      put:
 *          summary: Updates a product with uset input
 *          tags:
 *              - Products
 *          description: Returns the updated product
 *          parameters:  
 *              in: path
 *              name: id
 *              desctiption: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 * 
 */

/**
 * @swagger
 * /api/products/{id}:
 *      put:
 *          summary: Updates a product with user input
 *          tags:
 *              - Products
 *          description: Returns the updated product
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: "Monitor Curvo 49 Pulgadas"
 *                              price:
 *                                  type: number
 *                                  example: 399
 *                              availability:    
 *                                  type: boolean
 *                                  example: true
 *          responses:
 *              200:
 *                  description: Succesfull response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              400:
 *                  description: Bad Request - Invalid ID or Invalid input data 
 *              404:
 *                  description: Product Not Found
 * 
 */

// put realiza modificaciones totales, con lo que le enviemos a nuestra base de datos
// para evitar eso usamos el update, o usamos validacion
// put reemplaza el elemento con lo que le envies
router.put('/:id',
    param('id').isInt().withMessage('ID no valido'), 
    body('name')
        .notEmpty().withMessage('El nombre del Producto no puede ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no valido')
        .notEmpty().withMessage('El precio del Producto no puede ir vacio')
        .custom((value) => value>0).withMessage('Precio no valido'),
    body('availability')
        .isBoolean().withMessage('Valor Para disponibilidad no valido'),
    handleInputErrors,
    updatedProduct)

/**
 * @swagger
 * /api/products/{id}:
 *      patch:
 *          summary: Update Product availability
 *          tags:
 *              - Products
 *          description: Returns the updated availability
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Succesfull response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              400:
 *                  description: Bad Request - Invalid ID 
 *              404:
 *                  description: Product Not Found 
 *          
 * 
 */

// patch se utiliza para realizar modificaciones parciales en un recurso existente
// permite realizar cambios especificos sin afectar al resto de la informacion
// no reemplaza todo, sino que modifica lo enviado
router.patch('/:id', 
    param('id').isInt().withMessage('ID no valido'),
    handleInputErrors,
    updateAvailability)

/**
 * @swagger
 * /api/products/{id}:
 *      delete:     
 *          summary: Delete the product by a given ID
 *          tags:
 *              - Products
 *          description: Returns a confirmation message
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to delete          
 *              required: true
 *              schema: 
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Succesfull response
 *                  content:
 *                      application/json:
 *                            schema:
 *                                type: string
 *                                value: 'Producto Eliminado'
 *              400:
 *                 description: Bad Request - Invalid ID
 *              404:
 *                 description: Product Not Found
 * 
 */


router.delete('/:id',
    param('id').isInt().withMessage('ID no valido'),
    handleInputErrors, 
    deleteProduct)

export default router

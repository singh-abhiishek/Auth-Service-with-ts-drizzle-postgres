import express from 'express'
import type { Express } from 'express'
import { authRouter } from './auth/routes.js'
import { authenticationMiddleware } from './middleware/auth-middleware.js'

export function createApplication(): Express{
    const app = express()

    // middlewares
    app.use(express.json())
    app.use(authenticationMiddleware())

    // Routes
    app.get('/', (req, res) => {
        return res.json({
            message: "welcome to Auth Service"
        })
    })

    app.use('/auth', authRouter)

    return app
}
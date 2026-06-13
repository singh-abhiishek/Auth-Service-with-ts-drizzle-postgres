import type { Request, Response } from 'express'
import { signupPayloadModel, signinPayloadModel } from './models.js'

import { db } from '../../db/index.js'
import { usersTable } from '../../db/schema.js'
import { eq } from 'drizzle-orm'

import { createHmac, randomBytes } from 'node:crypto'
import { createUserToken } from './utils/token.js'


class AuthenticationController {

    public async handleSignUp(req: Request, res: Response) {

        const validationResult = await signupPayloadModel.safeParseAsync(req.body)

        if (validationResult.error) {
            return res
                .status(400)
                .json({
                    message: "signup payload validation failed",
                    error: validationResult.error.issues
                })
        }

        const { firstName, lastName, email, password } = validationResult?.data

        const userEmailResult = await db.select().from(usersTable).where(eq(usersTable.email, email))

        if (userEmailResult.length > 0) {
            return res
                .status(400)
                .json({
                    message: `user with email ${email} already exists`,
                    error: 'duplicate entry'
                })
        }

        // create salt
        const salt = randomBytes(32).toString('hex')
        const hash = createHmac('sha256', salt).update(password).digest('hex')

        const [result] = await db.insert(usersTable).values({
            firstName,
            lastName,
            email,
            password: hash,
            salt
        }).returning({ id: usersTable.id })

        return res
            .status(200)
            .json({
                message: "User has been created successfully",
                data: { id: result?.id }
            })
    }

    public async handleSignin(req: Request, res: Response) {
        const validationResult = await signinPayloadModel.safeParseAsync(req.body)

        if (validationResult.error) {
            return res
                .status(400)
                .json({
                    message: "signup payload validation failed",
                    error: validationResult.error.issues
                })
        }

        const { email, password } = validationResult.data

        const [userSelect] = await db.select().from(usersTable).where(eq(usersTable.email, email))

        if (!userSelect) {
            return res
                .status(404)
                .json({
                    message: `user with email ${email} does not exist `
                })
        }

        const salt = userSelect.salt!
        const hash = createHmac('sha256', salt).update(password).digest('hex')

        if (userSelect.password != hash) {
            return res
                .status(404)
                .json({
                    message: `email or password is incorrect`
                })
        }

        const token = createUserToken({ id: userSelect.id })

        return res
            .status(201)
            .json({
                message: 'signin success',
                token
            })
    }
}

export default AuthenticationController
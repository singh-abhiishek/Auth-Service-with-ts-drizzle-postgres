import JWT from 'jsonwebtoken'

export interface UserTokenPayload{
    id: string
}

const secret = process.env.JWT_SECRET

export function createUserToken(payload: UserTokenPayload){

    if(secret){
        const token = JWT.sign(payload, secret)
        return token;
    }

    return null
}

export function verifyUserToken(token: string){
    try {
        if(!secret) return null

        const payload = JWT.verify(token, secret) as UserTokenPayload
        return payload

    } catch (error) {
        return null
    }
}
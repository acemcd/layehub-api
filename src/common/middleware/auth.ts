import HttpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { loadConfig } from '../../config/config';
import { ErrorCode, ErrorType } from '../constants/errors';

const config = loadConfig();

const validateJwt = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers || !req.headers['authorization']) {
    res.status(403).send({
      type: ErrorType.ApiError,
      code: ErrorCode.ParameterInvalid,
      message: 'Something went wrong'
    });
    return;
  }

  //Get the jwt token from the head
  const token = <string>req.headers['authorization'];
  try {
    const jwtPayload = <any>(
      jwt.verify(token.replace('Bearer ', ''), config.jwtSecret)
    );
    req.user = jwtPayload;
    // req.user
  } catch (error) {
    // res.status(401).send(errorResponse(HttpStatus.UNAUTHORIZED, '', true));
    res.status(401).send({
      type: ErrorType.ApiError,
      code: ErrorCode.UnauthorizedAction,
      message: 'Unauthorized'
    });
    return;
  }
};

const mockJwt = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers || !req.headers['authorization']) {
    res.status(403).send({
      type: ErrorType.ApiError,
      code: ErrorCode.ParameterInvalid,
      message: 'Something went wrong'
    });
    return;
  }
  next();
};

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  mockJwt(req, res, next);
  // if (!req.headers || !req.headers['authorization']) {
  //   res.status(403).send({
  //     type: ErrorType.ApiError,
  //     code: ErrorCode.ParameterInvalid,
  //     message: 'Something went wrong'
  //   });
  //   return;
  // }

  // //Get the jwt token from the head
  // const token = <string>req.headers['authorization'];
  // try {
  //   const jwtPayload = <any>(
  //     jwt.verify(token.replace('Bearer ', ''), config.jwtSecret)
  //   );
  //   req.user = jwtPayload;
  //   // req.user
  // } catch (error) {
  //   // res.status(401).send(errorResponse(HttpStatus.UNAUTHORIZED, '', true));
  //   res.status(401).send({
  //     type: ErrorType.ApiError,
  //     code: ErrorCode.UnauthorizedAction,
  //     message: 'Unauthorized'
  //   });
  //   return;
  // }

  // next();
};

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

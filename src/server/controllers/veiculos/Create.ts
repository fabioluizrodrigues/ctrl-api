import { isValidLicensePlate } from '@brazilian-utils/brazilian-utils';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { IVeiculo } from '../../database/models';
import { VeiculosProvider } from '../../database/providers/veiculos';
import { validation } from '../../shared/middleware';

interface IBodyProps extends Omit<IVeiculo, 'id'> { }

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    placa: yup.string().required()
      .test('is-valid-plate', 'Placa inválida', (value) => isValidLicensePlate(value as string)),
    renavam: yup.string().required().max(20),
    nr_eixos: yup.number().required(),
    ano_fabrica: yup.number().notRequired(),
    ano_modelo: yup.number().notRequired(),
    ano_exercicio: yup.number().notRequired(),
    marca: yup.string().notRequired().min(3).max(150),
    modelo: yup.string().notRequired().min(3).max(150),
    cor: yup.string().notRequired().min(3).max(100),
    observacoes: yup.string().notRequired().min(3).max(255)
  }))
}));

export const create = async (req: Request<{}, {}, IVeiculo>, res: Response) => {

  const result = await VeiculosProvider.create(req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.CREATED).json(result);
};
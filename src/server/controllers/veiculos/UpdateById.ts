import { isValidLicensePlate } from '@brazilian-utils/brazilian-utils';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { IVeiculo } from '../../database/models';
import { VeiculosProvider } from '../../database/providers/veiculos';
import { validation } from '../../shared/middleware';

interface IParamProps {
  id?: number;
}

interface IBodyProps extends Omit<IVeiculo, 'id'> { }

export const updateByIdValidation = validation((getSchema) => ({
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
  })),
  params: getSchema<IParamProps>(yup.object().shape({
    id: yup.number().integer().required().moreThan(0)
  }))
}));

export const updateById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {

  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        default: 'O parâmetro "id" precisa ser informado.'
      }
    });
  }

  const result = await VeiculosProvider.updateById(req.params.id, req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.NO_CONTENT).send(result);
};
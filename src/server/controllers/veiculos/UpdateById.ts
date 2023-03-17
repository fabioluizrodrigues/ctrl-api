import { isValidLicensePlate } from '@brazilian-utils/brazilian-utils';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { IVeiculo } from '../../database/models';
import { VeiculosProvider } from '../../database/providers/veiculos';
import { validation } from '../../shared/middleware';

interface IParamProps {
  id?: string;
}

interface IBodyProps extends Omit<IVeiculo, 'id' | 'organizacao_id'> { }

export const updateByIdValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    placa: yup.string().required()
      .test(
        'is-valid-plate',
        'Placa O formato da placa é inválido.',
        (value) => isValidLicensePlate(value as string)
      ),
    renavam: yup.string().required().max(20),
    nr_eixos: yup.number().required().min(2),
    ano_fabrica: yup.number().optional(),
    ano_modelo: yup.number().optional(),
    ano_exercicio: yup.number().optional(),
    marca: yup.string().optional().min(3).max(150),
    modelo: yup.string().optional().min(3).max(150),
    cor: yup.string().optional().min(3).max(100),
    observacoes: yup.string().optional().min(3).max(255)
  })),
  params: getSchema<IParamProps>(yup.object().shape({
    id: yup.string().required().uuid()
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

  const veiculo: Omit<IVeiculo, 'id'> = {
    organizacao_id: String(req.headers.organizacao_id),
    placa: req.body.placa,
    renavam: req.body.renavam,
    nr_eixos: req.body.nr_eixos,
    ano_fabrica: req.body.ano_fabrica,
    ano_modelo: req.body.ano_modelo,
    ano_exercicio: req.body.ano_exercicio,
    marca: req.body.marca,
    modelo: req.body.modelo,
    cor: req.body.cor,
    observacoes: req.body.observacoes
  };


  const result = await VeiculosProvider.updateById(req.params.id, veiculo);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.NO_CONTENT).send(result);
};
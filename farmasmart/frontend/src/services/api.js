import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export const getMedicamentos  = ()             => api.get("/medicamentos");
export const getAlertas       = (dias)         => api.get(`/medicamentos/alertas?dias=${dias}`);
export const getFaixa         = (inicio, fim)  => api.get(`/medicamentos/faixa?inicio=${inicio}&fim=${fim}`);
export const cadastrarMed     = (payload)      => api.post("/medicamentos", payload);
export const removerMed       = (id)           => api.delete(`/medicamentos/${id}`);
export const getCategorias    = ()             => api.get("/categorias");

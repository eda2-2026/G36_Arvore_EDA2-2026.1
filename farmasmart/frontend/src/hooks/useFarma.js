import { useState, useEffect, useCallback } from "react";
import { getMedicamentos, getAlertas, getFaixa, cadastrarMed, removerMed, getCategorias } from "../services/api";

export function useFarma() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [stats,        setStats]        = useState(null);
  const [categorias,   setCategorias]   = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [erro,         setErro]         = useState(null);

  const carregar = useCallback(async () => {
    setLoading(true); setErro(null);
    try {
      const [resMed, resCat] = await Promise.all([getMedicamentos(), getCategorias()]);
      setMedicamentos(resMed.data.medicamentos);
      setStats(resMed.data.stats);
      setCategorias(resCat.data);
    } catch {
      setErro("Erro ao carregar. Verifique se o backend está rodando.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const buscarAlertas = async (dias) => {
    const { data } = await getAlertas(dias);
    return data.medicamentos;
  };

  const buscarFaixa = async (inicio, fim) => {
    const { data } = await getFaixa(inicio, fim);
    return data.medicamentos;
  };

  const cadastrar = async (payload) => {
    await cadastrarMed(payload);
    await carregar();
  };

  const remover = async (id) => {
    await removerMed(id);
    await carregar();
  };

  return { medicamentos, stats, categorias, loading, erro, cadastrar, remover, buscarAlertas, buscarFaixa, recarregar: carregar };
}

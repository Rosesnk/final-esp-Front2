import { useEffect, useState } from "react";
import NewsCard from "./card/NewsCard";
import { obtenerNoticias } from "./fakeRest";
import NewsModal from "./modals/NewsModal";
import { ContenedorNoticias, ListaNoticias, TituloNoticias } from "./styled";
import { INoticiasNormalizadas, IModal } from "./types";

const News = () => {
  const [noticias, setNoticias] = useState<INoticiasNormalizadas[]>([]);
  const [modal, setModal] = useState<IModal>({
    noticia: null,
    visible: false,
  });


  const capitalizarPrimeraLetraPorPalabra = (texto: string): string => {
    return texto
      .split(" ")
      .map((str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      })
      .join(" ");
  };


  const obtenerTiempoTranscurridoEnMinutos = (fecha: Date | string): number => {
    const fechaActual = new Date();
    const fechaParametro = new Date(fecha);
    const diferencia = fechaActual.getTime() - fechaParametro.getTime();
    return Math.floor(diferencia / (1000 * 60));
  };


  const acortarTexto = (texto: string, cantidadCaracteres: number): string => {
    return texto.substring(0, cantidadCaracteres) + "...";
  };

  useEffect(() => {
    const obtenerInformacion = async () => {
      const respuesta = await obtenerNoticias();

      const data = respuesta.map((noticia) => {
        const titulo = capitalizarPrimeraLetraPorPalabra(noticia.titulo);
        const minutosTranscurridos = obtenerTiempoTranscurridoEnMinutos(
          noticia.fecha
        );
        const descripcionCorta = acortarTexto(noticia.descripcion, 100);

        return {
          id: noticia.id,
          titulo,
          descripcion: noticia.descripcion,
          fecha: `Hace ${minutosTranscurridos} minutos`,
          esPremium: noticia.esPremium,
          imagen: noticia.imagen,
          descripcionCorta: descripcionCorta,
        };
      });

      setNoticias(data);
    };

    obtenerInformacion();
  }, []);

  return (
    <ContenedorNoticias>
      <TituloNoticias>Noticias de los Simpsons</TituloNoticias>
      <ListaNoticias>
        {noticias.map((noticia) => (
          <NewsCard
            noticia={noticia}
            setModal={setModal}
            key={noticia.id.toString()}
          />
        ))}
        {modal.visible && (
          <NewsModal noticia={modal.noticia} setModal={setModal} />
        )}
      </ListaNoticias>
    </ContenedorNoticias>
  );
};

export default News;

import { Component, OnInit } from '@angular/core';
import { ModulosService } from '../../servicios/modulos.service';
import Swal from 'sweetalert2';

interface CursoFormato6 {
  formato6_codigo: number;
  formato1_codigo_curso?: string | null;
  formato1_curso_definido?: string | null;
  modulos: { id: number; nombre: string }[];
}

interface Formato9Guardado {
  formato9_codigo: number;
  formato6_codigo: number;
  formato9_modulo_id: number;
}

interface CronogramaItem {
  modulo: string;
  desde: string;
  hasta: string;
  actividad: string;
  dias: string;
  horario: string;
  horas_totales: number;
}

interface PresupuestoFormato6 {
  valor: string | number | null;
}

interface DatosNovena {
  nombreCurso: string;
  nombreModulo: string;
  diasContratacion: string;
  diasEjecucion: string;
  diasTrabajo: string;
  horarioTrabajo: string;
}

interface DirectorFormato9 {
  tit_dir: string | null;
  nom_dir: string | null;
  ape_dir: string | null;
}

interface AutoridadFormato9 {
  titulo: string | null;
  nom_aut: string | null;
  ape_aut: string | null;
}

@Component({
  selector: 'app-formatonueve',
  templateUrl: './formatonueve.component.html',
  styleUrls: ['./formatonueve.component.css']
})
export class FormatonueveComponent implements OnInit {
  cursosFormato6: CursoFormato6[] = [];
  formatos9Guardados: Formato9Guardado[] = [];
  formato6SeleccionadoCodigo: number | null = null;
  formato6ModuloId: number | null = null;
  yaExiste = false;
  cargandoCursos = false;
  cargandoNovena = false;
  guardando = false;
  datosNovena: DatosNovena | null = null;
  private nombreAutoridadFormato9 = '****';
  textosContrato = [{
    id: 1,
    texto: 'En la ciudad de Ambato, a los ** días del mes de ** de 20**, comparecen por una parte la ****, en calidad de Directora de Educación Continua, a Distancia y Virtual de la Universidad Técnica de Ambato, debidamente facultado mediante Resolución Administrativa Nro. **** del ** de **** de 20**, a quién en adelante y para efectos del presente contrato se le podrá llamar El Contratante; o, simplemente “La Universidad”; y, por otra parte el *****, quienes: por los derechos que se representa y por el suyo propio, respectivamente, libre y voluntariamente tienen a bien celebrar el presente Contrato de Prestación de Servicios Profesionales de conformidad a lo previsto en el inciso 2do de la Disposición General Primera del Reglamento de Aplicación del Mandato Constituyente No 8 reformado, mediante Decreto Ejecutivo Nº 1121 del 2008, reformado por el Art. 5 del Decreto Ejecutivo. 1313, en concordancia con lo estipulado en los Art. 149 y 153 de la Ley Orgánica de Educación Superior, al tenor de las siguientes cláusulas y estipulaciones que se señalan a continuación; así: '
  },
  {
    id: 2,
    texto: 'PRIMERA.- ANTECEDENTES.- 1) En el Art. 10  del  Estatuto de la Universidad Técnica de Ambato, constan como objetivos y estrategias  fundamentales: literal a) Formar talento humano de grado y posgrado a través de diferentes modalidades, con liderazgo, responsabilidad social y ambiental, con sólidos conocimientos científicos, tecnológicos y culturales, que interpreten y comprendan la realidad socioeconómica del Ecuador, de Latinoamérica y del mundo y que emprendan de manera autónoma en iniciativas que propicien el desarrollo socioeconómico de la provincia, la región y el país; y para cuyo efecto el ya referido Estatuto Universitario en su art. 16, literal m) indica, como una de las atribuciones y deberes del H. Consejo Universitario, el de autorizar la contratación de profesores/as e investigadores/as, en los casos que considere necesario.'+'\n\n'+
    
    
    '2) La suscripción del presente contrato procede vista las Resoluciones **** de fecha ** de **** del 20** emitida por el Consejo Académico Universitario mediante el cual se aprueba el Curso “*****"; y Resolución: **** de fecha ** de **** de 20** emitida por H. Consejo Universitario de la Institución mediante la cual se autoriza a la señora Rectora o su delegado, la suscripción del contrato de la Instructora del curso en mención; evento planificado por la Dirección de Educación Continua, a Distancia y Virtual y dirigido a profesores universitarios y público en general, y ante la delegación  de la señora Rectora antes señalada, la  Directora de Educación Continua, a Distancia y Virtual, tiene a bien efectuar, la Contratación del ****  en calidad de Instructor del Curso: “*****” Módulo **, del ** al ** de **** del 20** con una duración de ** horas, así como también, autorizar el pago de USD **** la hora clase respectivamente; la misma que se formaliza en acatamiento a lo previsto en el Inciso 2do de la Disposición General Primera del Reglamento de Aplicación del Mandato Nro. 8 reformado, bajo la Modalidad de Contratación de Servicios Profesionales sin relación de dependencia laboral y sujeto a las disposiciones legales que se hallan contenidas en el Código Civil.'
  },
  {
    id: 3,
    texto: 'SEGUNDA.- Por los antecedentes que quedan expuestos, y vistas las Resoluciones señaladas en el numeral 2 de la CLAUSULA PRIMERA de los antecedentes, la Mg. Wilma Lorena Gavilanes López, en calidad de Directora de Educación Continua a Distancia y Virtual de la Universidad Técnica de Ambato, por Delegación de la Rectora Dra. Sara Camacho Estrada PhD., conforme queda señalado en líneas anteriores, tiene a bien Página 1 de 4 contratar los servicios lícitos y personales que prestará el ****, en calidad de Instructor del Curso: “*****”, en modalidad ****, las clases en modalidad virtual los días **,**,** de **** 20**, evento organizado por la Dirección de Educación Continua, a Distancia y Virtual de la UTA y dirigido a profesores universitarios y público en general.'
  },
  {
    id: 4,
    texto: 'TERCERA. - El presente contrato regirá a las partes días *** de **** 20**. '
  },

  {
    id: 5,
    texto: 'CUARTA. - La Unidad de Vinculación con la Sociedad y Prestación de Servicios de la Universidad Técnica de Ambato por su parte, pagará al profesional *****, por concepto de honorarios profesionales por los servicios que prestará, la suma total de **** DÓLARES DE LOS ESTADOS UNIDOS DE NORTEAMÉRICA (USD ****); a razón de USD *** la hora clase, por las ** horas dictadas en el referido curso. Pago que se lo efectuará a la finalización del presente contrato descrito en la CLÁUSULA TERCERA, previo informe de la Dirección de Educación Continua, a Distancia y Virtual, así como también previa presentación de la correspondiente factura, la misma que deberá cumplir con los requisitos señalados en el reglamento de facturación expedido por el SRI. El egreso se aplicará con cargo a la partida presupuestaria No. ***** Honorarios por Contratos Civiles de Servicios de conformidad a la certificación presupuestaria No. ** de fecha ** de *** de 20**. '
  },
  {
    id: 6,
    texto: 'QUINTA. - Se aclara que el pago mencionado en el presente contrato corresponde a honorarios profesionales, a favor del Contratado y, en el mismo no está incluido el Impuesto al Valor Agregado (IVA). '
  },
  {
    id: 7,
    texto: 'SEXTA. - CONFIDENCIALIDAD, USO DE RECURSOS INSTITUCIONALES Y NOTIFICACIÓN DE INCIDENTES DE SEGURIDAD.- El instructor reconoce que toda información académica, administrativa o tecnológica a la que acceda con ocasión del presente contrato, así como los usuarios, contraseñas, plataformas virtuales, registros, evaluaciones, reportes, contenidos internos, bases de datos y demás recursos institucionales puestos a su disposición por la Universidad Técnica de Ambato, son de uso restringido y deberán emplearse únicamente para la ejecución de las actividades contratadas. En tal virtud, guardará estricta reserva sobre dicha información, incluso después de concluida la relación contractual; se abstendrá de compartirla con terceros, reproducirla, conservarla o utilizarla en beneficio propio o ajeno fuera del ámbito expresamente autorizado; y deberá informar de manera inmediata a la Universidad cualquier incidente, acceso no autorizado, pérdida, filtración, alteración o uso indebido que comprometa o pueda comprometer la confidencialidad, integridad o disponibilidad de los datos personales o de la información institucional a la que hubiere tenido acceso con ocasión del contrato.” '
  },

  {
    id: 8,
    texto: 'SÉPTIMA. - TRATAMIENTO DE DATOS PERSONALES DEL INSTRUCTOR. - La Universidad Técnica de Ambato, por intermedio de la Dirección de Educación Continua a Distancia y Virtual, en calidad de responsable del tratamiento, tratará los datos personales del instructor exclusivamente para fines relacionados con su vinculación, celebración, ejecución, seguimiento, control, pago, archivo y cierre de la relación contractual, así como para el cumplimiento de obligaciones legales e institucionales. Dicho tratamiento se realizará con observancia de la Constitución de la República del Ecuador, la Ley Orgánica de Protección de Datos Personales, su normativa aplicable y la normativa interna institucional pertinente. La Universidad tratará únicamente los datos que resulten necesarios para las finalidades antes indicadas, adoptará las medidas de seguridad adecuadas y los conservará durante el tiempo exigido por la finalidad del tratamiento y por las obligaciones legales aplicables. El instructor podrá ejercer, conforme a la ley, los derechos que le asisten respecto de sus datos personales.'
  },

  {
    id: 9,
    texto: 'OCTAVA. - ACCESO Y TRATAMIENTO DE DATOS PERSONALES DE PARTICIPANTES O ASISTENTES. - Para la ejecución del curso o evento académico objeto del presente contrato, el instructor podrá acceder a datos personales de participantes, asistentes o estudiantes únicamente en la medida en que dicho acceso resulte necesario para el cumplimiento de las actividades expresamente encomendadas por la Universidad Técnica de Ambato. En este ámbito, el instructor actuará en calidad de encargado del tratamiento, a nombre y por cuenta de la Universidad y bajo sus instrucciones. En consecuencia, se obliga a tratar dichos datos exclusivamente para la ejecución del objeto contractual; a no utilizarlos para fines distintos a los autorizados; Página 2 de 4 a no transferirlos, comunicarlos, divulgarlos ni permitir el acceso de terceros no autorizados; a observar las medidas de seguridad, reserva y cuidado previstas en la legislación aplicable, en este contrato y en la normativa institucional pertinente; y, una vez concluida la prestación del servicio, a cesar en su uso y proceder a su devolución, eliminación o destrucción, según corresponda y conforme a las instrucciones impartidas por la Universidad.'+'\n\n'+'Declara aceptar el Consentimiento Informado para el Tratamiento de Datos Personales y el Acuerdo de Uso y Confidencialidad de datos Institucionales, anexos al presente. '
  },
  {
    id:10,
    texto: 'NOVENA. - El “Profesional”, desempeñará las actividades inherentes a las de Instructor del Curso: “DOCENCIA UNIVERSITARIA: INNOVACIÓN PEDAGÓGICA Y DISEÑO DE CONTENIDOS DIGITALES CON INTELIGENCIA ARTIFICIAL GENERATIVA” Módulo 1, materia del presente contrato, en la ciudad de Ambato con el siguiente horario, como se detalla en el cuadro:  '
  },
  {
    id:11,
    texto: 'DECIMA. - NATURALEZA JURÍDICA DEL CONTRATO. - El presente contrato es de naturaleza Civil y no se encuentra sujeto a la Ley Orgánica de Servicio Público y su Reglamento.'
  },
   {
    id:12,
    texto: 'DÉCIMA PRIMERA. - Se aclara que la Universidad Técnica de Ambato no reconoce gastos de movilización alimentación, hospedaje o cualquier otro gasto que realice el Profesional.'
  },
  {
    id:13,
    texto: 'DÉCIMA SEGUNDA. - En caso de que el profesional contratado labore en otra institución pública declara bajo juramento; que a más de desempeñar las actividades justificadas con los horarios certificados que se incorporan al presente contrato, no tiene vigente otro Contrato por servicios profesionales de Docencia en fechas simultáneas en otra unidad académica perteneciente a la Universidad Técnica de Ambato, ni labora en otra institución pública; información de la cual se constituye el único responsable.'+'\n\n'+'Por otra parte, el profesional declara bajo juramento no estar comprendido dentro de las prohibiciones señaladas en el Art. 230 de la Constitución de la República del Ecuador, por lo que está totalmente habilitado para suscribir el presente contrato.'
  },
  {
    id:14,
    texto: 'DÉCIMA TERCERA. - Salvo circunstancias de fuerza mayor o caso fortuito debidamente comprobado por parte del Profesional Contratado, que determinen el retraso o incumplimiento de las obligaciones contractuales, se compromete a pagar a la Universidad Técnica de Ambato los daños y perjuicios ocasionados o que llegare a ocasionar a ésta por manifiesto incumplimiento de obligaciones por causas que no tengan justificación alguna.'
  },

  {
    id:15,
    texto: 'DÉCIMA CUARTA. - CONTROVERSIAS.- Para el evento de suscitarse divergencias o controversias de la falta del cumplimiento del presente contrato que determinen retraso o incumplimiento de las obligaciones contractuales, éstas tratarán de llegar a un acuerdo que solucione el problema; y, en el caso de no obtenerse el acuerdo de las partes del asunto controvertido, podrán someterlo, libre y voluntariamente, a los procesos de mediación en el Centro de Arbitraje y Mediación de la Procuraduría General del Estado, de conformidad con lo establecido en la Ley de Arbitraje y Mediación sin que este involucre un perjuicio a la Universidad. En última instancia, se demandará ante los jueces civiles de este cantón, para lo cual renuncian al fuero y domicilio preferente. '
  },
  {
    id:16                        ,
    texto: 'DÉCIMA QUINTA: ACEPTACIÓN DE LAS PARTES. - Libre y voluntariamente, previo el cumplimiento de los requisitos exigidos por las leyes de la materia, las partes declaran su aceptación a todo lo convenido en el presente Contrato, a cuyas estipulaciones se someten.'+'\n\n'+'Para constancia, las partes suscriben el presente contrato en un original.'
  },

];

  private siguienteTextoId = Math.max(...this.textosContrato.map((texto) => texto.id), 0) + 1;

  constructor(private modulosService: ModulosService) {}

  ngOnInit(): void {
    this.cargarCursosFormato6();
    this.cargarFormatos9();
    this.cargarDirector();
    this.cargarAutoridad();
  }

  cargarAutoridad(): void {
    this.modulosService.obtenerAutoridades({ fx: 'getautoridades', d: {} }).subscribe({
      next: (respuesta: any) => {
        const autoridad: AutoridadFormato9 | undefined = respuesta?.data?.item?.[0];
        if (!respuesta?.data?.success || !autoridad) {
          Swal.fire('Error', respuesta?.data?.message || 'No se encontró la autoridad para el Texto 2.', 'error');
          return;
        }

        const nombreAutoridad = [autoridad.titulo, autoridad.nom_aut, autoridad.ape_aut]
          .map((parte) => parte?.trim())
          .filter((parte): parte is string => Boolean(parte))
          .join(' ');
        if (!nombreAutoridad) {
          Swal.fire('Error', 'Los datos de la autoridad no contienen título, nombre ni apellido.', 'error');
          return;
        }

        this.nombreAutoridadFormato9 = nombreAutoridad;
        const textoAntecedentes = this.textosContrato.find((texto) => texto.id === 2);
        if (textoAntecedentes) {
          textoAntecedentes.texto = textoAntecedentes.texto.replace(
            /(la Contratación del )\*{4}/,
            (_coincidencia, prefijo: string) => `${prefijo}${nombreAutoridad}`
          );
        }
        this.actualizarAutoridadEnTexto3();
      },
      error: (error: any) => {
        console.error('Error al cargar la autoridad para el Formato 9:', error);
        Swal.fire('Error', 'No se pudo cargar la autoridad para el Texto 2.', 'error');
      }
    });
  }

  private actualizarCursoDefinidoEnTexto2(): void {
    const nombreCurso = this.cursoSeleccionado?.formato1_curso_definido?.trim() || '*****';
    const modulo = this.modulosDisponibles.find(
      (item) => Number(item.id) === Number(this.formato6ModuloId)
    );
    const nombreModulo = modulo?.nombre?.trim() || '**';
    const textoAntecedentes = this.textosContrato.find((texto) => texto.id === 2);
    if (textoAntecedentes) {
      textoAntecedentes.texto = textoAntecedentes.texto.replace(
        /(se aprueba el Curso “).*?(";\s*y Resolución)/,
        (_coincidencia, prefijo: string, sufijo: string) => `${prefijo}${nombreCurso}${sufijo}`
      );
      textoAntecedentes.texto = textoAntecedentes.texto.replace(
        /(en calidad de Instructor del Curso: “).*?(” Módulo )[^,]*(?=, del)/,
        (_coincidencia, prefijo: string, separador: string) =>
          `${prefijo}${nombreCurso}${separador}${nombreModulo}`
      );
    }

    const textoSegundaClausula = this.textosContrato.find((texto) => texto.id === 3);
    if (textoSegundaClausula) {
      textoSegundaClausula.texto = textoSegundaClausula.texto.replace(
        /(en calidad de Instructor del Curso: “).*?(”)/,
        (_coincidencia, prefijo: string, sufijo: string) => `${prefijo}${nombreCurso}${sufijo}`
      );
    }
  }

  private actualizarAutoridadEnTexto3(): void {
    const textoSegundaClausula = this.textosContrato.find((texto) => texto.id === 3);
    if (textoSegundaClausula) {
      textoSegundaClausula.texto = textoSegundaClausula.texto.replace(
        /(prestará el ).*?(, en calidad de Instructor)/,
        (_coincidencia, prefijo: string, sufijo: string) =>
          `${prefijo}${this.nombreAutoridadFormato9}${sufijo}`
      );
    }

    const textoCuartaClausula = this.textosContrato.find((texto) => texto.id === 5);
    if (textoCuartaClausula) {
      textoCuartaClausula.texto = textoCuartaClausula.texto.replace(
        /(pagará al profesional ).*?(, por concepto de honorarios)/,
        (_coincidencia, prefijo: string, sufijo: string) =>
          `${prefijo}${this.nombreAutoridadFormato9}${sufijo}`
      );
    }
  }

  private actualizarModalidadEnTexto3(modalidad: string | null | undefined): void {
    const textoSegundaClausula = this.textosContrato.find((texto) => texto.id === 3);
    if (textoSegundaClausula) {
      const modalidadTexto = modalidad?.trim() || '****';
      textoSegundaClausula.texto = textoSegundaClausula.texto.replace(
        /(en modalidad ).*?(, las clases en modalidad virtual)/,
        (_coincidencia, prefijo: string, sufijo: string) => `${prefijo}${modalidadTexto}${sufijo}`
      );
    }
  }

  private actualizarFechasEjecucionEnTexto3(itemsModulo: CronogramaItem[]): string {
    const fechasPorMes = new Map<string, Set<number>>();
    const numeroDiaSemana: { [dia: string]: number } = {
      domingo: 0,
      lunes: 1,
      martes: 2,
      miercoles: 3,
      jueves: 4,
      viernes: 5,
      sabado: 6
    };

    itemsModulo.forEach((item) => {
      if (!item.desde || !item.hasta) {
        return;
      }
      const diasProgramados = new Set(
        (item.dias || '').split(',').map((dia) =>
          dia.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
        ).filter(Boolean)
      );
      const inicio = new Date(`${item.desde.slice(0, 10)}T00:00:00`);
      const fin = new Date(`${item.hasta.slice(0, 10)}T00:00:00`);
      if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
        return;
      }

      for (const fecha = new Date(inicio); fecha <= fin; fecha.setDate(fecha.getDate() + 1)) {
        const dia = Object.keys(numeroDiaSemana).find((nombre) => numeroDiaSemana[nombre] === fecha.getDay());
        if (!dia || !diasProgramados.has(dia)) {
          continue;
        }
        const claveMes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        if (!fechasPorMes.has(claveMes)) {
          fechasPorMes.set(claveMes, new Set<number>());
        }
        fechasPorMes.get(claveMes)?.add(fecha.getDate());
      }
    });

    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const fechasTexto = Array.from(fechasPorMes.entries())
      .sort(([mesA], [mesB]) => mesA.localeCompare(mesB))
      .map(([claveMes, dias]) => {
        const [anio, mes] = claveMes.split('-').map(Number);
        const listaDias = Array.from(dias).sort((a, b) => a - b).join(', ');
        return `${listaDias} de ${meses[mes - 1]} de ${anio}`;
      })
      .join('; ') || '**,**,** de **** 20**';

    const textoSegundaClausula = this.textosContrato.find((texto) => texto.id === 3);
    if (textoSegundaClausula) {
      textoSegundaClausula.texto = textoSegundaClausula.texto.replace(
        /(las clases en modalidad virtual los días ).*?(?=, evento organizado)/,
        (_coincidencia, prefijo: string) => `${prefijo}${fechasTexto}`
      );
    }

    const textoTerceraClausula = this.textosContrato.find((texto) => texto.id === 4);
    if (textoTerceraClausula) {
      textoTerceraClausula.texto = textoTerceraClausula.texto.replace(
        /días .*?20\*\*/,
        `días ${fechasTexto}`
      );
    }

    return fechasTexto;
  }

  cargarDirector(): void {
    this.modulosService.obtenerDirectores({ fx: 'getdirectores', d: {} }).subscribe({
      next: (respuesta: any) => {
        const director: DirectorFormato9 | undefined = respuesta?.data?.item?.[0];
        if (!respuesta?.data?.success || !director) {
          Swal.fire('Error', respuesta?.data?.message || 'No se encontró el director para el Texto 1.', 'error');
          return;
        }

        const nombreDirector = [director.tit_dir, director.nom_dir, director.ape_dir]
          .map((parte) => parte?.trim())
          .filter((parte): parte is string => Boolean(parte))
          .join(' ');
        if (!nombreDirector) {
          Swal.fire('Error', 'Los datos del director no contienen título, nombre ni apellido.', 'error');
          return;
        }

        const textoInicial = this.textosContrato.find((texto) => texto.id === 1);
        if (textoInicial) {
          textoInicial.texto = textoInicial.texto.replace(
            'comparecen por una parte la ****,',
            `comparecen por una parte la ${nombreDirector},`
          );
        }
      },
      error: (error: any) => {
        console.error('Error al cargar el director para el Formato 9:', error);
        Swal.fire('Error', 'No se pudo cargar el director para el Texto 1.', 'error');
      }
    });
  }

  get cursoSeleccionado(): CursoFormato6 | null {
    return this.cursosFormato6.find(
      (curso) => Number(curso.formato6_codigo) === Number(this.formato6SeleccionadoCodigo)
    ) || null;
  }

  get modulosDisponibles(): CursoFormato6['modulos'] {
    return this.cursoSeleccionado?.modulos || [];
  }

  seleccionarCurso(): void {
    this.formato6ModuloId = null;
    this.yaExiste = false;
    this.datosNovena = null;
    this.actualizarCursoDefinidoEnTexto2();
    this.actualizarModalidadEnTexto3(undefined);
    this.actualizarDatosEjecucionEnTexto2([], undefined);
    this.actualizarFechasEjecucionEnTexto3([]);
  }

  seleccionarModulo(): void {
    this.yaExiste = this.formatos9Guardados.some(
      (f) =>
        Number(f.formato6_codigo) === Number(this.formato6SeleccionadoCodigo) &&
        Number(f.formato9_modulo_id) === Number(this.formato6ModuloId)
    );
    this.actualizarCursoDefinidoEnTexto2();
    this.actualizarDatosEjecucionEnTexto2([], undefined);
    this.actualizarFechasEjecucionEnTexto3([]);
    this.cargarDatosNovena();
  }

  cargarDatosNovena(): void {
    if (!this.formato6SeleccionadoCodigo || !this.formato6ModuloId) {
      this.datosNovena = null;
      return;
    }
    const curso = this.cursoSeleccionado;
    const modulo = this.modulosDisponibles.find((m) => Number(m.id) === Number(this.formato6ModuloId));
    if (!curso || !modulo) {
      this.datosNovena = null;
      return;
    }

    this.cargandoNovena = true;
    this.modulosService.obtenerFormato6Reporte({
      fx: 'getformato6Reporte',
      d: { formato6_codigo: this.formato6SeleccionadoCodigo },
      dpro: 0, dus: 0, dcx: 1
    }).subscribe({
      next: (res: any) => {
        this.cargandoNovena = false;
        const formato = res?.data?.item?.[0];
        if (!formato) { this.datosNovena = null; return; }
        this.actualizarModalidadEnTexto3(formato.formato1_modalidad_nombre || formato.formato6_modalidad);

        const cronograma: CronogramaItem[] = Array.isArray(formato.cronograma) ? formato.cronograma : [];
        const nombreModuloNorm = modulo.nombre.trim().toLowerCase();

        // Filtrar items del cronograma que pertenecen al módulo seleccionado
        const itemsModulo = cronograma.filter((c) =>
          c.modulo?.trim().toLowerCase() === nombreModuloNorm
        );
        const presupuesto: PresupuestoFormato6[] = Array.isArray(formato.presupuesto)
          ? formato.presupuesto
          : [];
        this.actualizarDatosEjecucionEnTexto2(itemsModulo, presupuesto[0]?.valor);
        const diasEjecucion = this.actualizarFechasEjecucionEnTexto3(itemsModulo);

        // Días de contratación: fechas formateadas del campo "desde/hasta" del módulo
        const primerItem = itemsModulo[0];
        let diasContratacion = '—';
        if (primerItem?.desde && primerItem?.hasta) {
          diasContratacion = `${this.formatearFecha(primerItem.desde)} al ${this.formatearFecha(primerItem.hasta)}`;
        }

        // Días de trabajo: combinar los días de todas las actividades del módulo
        const diasSet = new Set<string>();
        itemsModulo.forEach((c) => {
          if (c.dias) {
            c.dias.split(',').map((d) => d.trim()).filter(Boolean).forEach((d) => diasSet.add(d));
          }
        });
        const diasTrabajo = diasSet.size > 0 ? Array.from(diasSet).join(', ') : '—';

        // Horario de trabajo: por tipo de actividad
        const horarioTrabajo = itemsModulo.length > 0
          ? itemsModulo.map((c) => `${c.actividad}: ${c.horario || '—'}`).join('\n')
          : '—';

        this.datosNovena = {
          nombreCurso: curso.formato1_curso_definido || '—',
          nombreModulo: modulo.nombre,
          diasContratacion,
          diasEjecucion,
          diasTrabajo,
          horarioTrabajo
        };
      },
      error: () => {
        this.cargandoNovena = false;
        this.datosNovena = null;
      }
    });
  }

  private actualizarDatosEjecucionEnTexto2(
    itemsModulo: CronogramaItem[],
    valorPrimeraFila: string | number | null | undefined
  ): void {
    const textoAntecedentes = this.textosContrato.find((texto) => texto.id === 2);
    if (!textoAntecedentes) {
      return;
    }

    const primerItemConFechas = itemsModulo.find((item) => item.desde && item.hasta);
    const fechasEjecucion = primerItemConFechas
      ? `del ${this.formatearFecha(primerItemConFechas.desde)} al ${this.formatearFecha(primerItemConFechas.hasta)}`
      : 'del ** al ** de **** del 20**';
    const horasTotales = itemsModulo.reduce((total, item) => {
      const horas = Number(item.horas_totales);
      return total + (Number.isFinite(horas) ? horas : 0);
    }, 0);
    const duracion = itemsModulo.length > 0 ? String(horasTotales) : '**';
    const precio = valorPrimeraFila !== null && valorPrimeraFila !== undefined && String(valorPrimeraFila).trim() !== ''
      ? String(valorPrimeraFila).trim()
      : '****';

    textoAntecedentes.texto = textoAntecedentes.texto.replace(
      /(Módulo )[^,]*(, )del .*?( con una duración de ).*?( horas, así como también, autorizar el pago de USD ).*?( la hora clase respectivamente;)/,
      (_coincidencia, prefijoModulo: string, separador: string, prefijoDuracion: string, separadorPago: string, sufijo: string) =>
        `${prefijoModulo}${this.modulosDisponibles.find((modulo) => Number(modulo.id) === Number(this.formato6ModuloId))?.nombre || '**'}${separador}${fechasEjecucion}${prefijoDuracion}${duracion}${separadorPago}${precio}${sufijo}`
    );

    const textoCuartaClausula = this.textosContrato.find((texto) => texto.id === 5);
    if (textoCuartaClausula) {
      textoCuartaClausula.texto = textoCuartaClausula.texto
        .replace(
          /(a razón de USD ).*?( la hora clase)/,
          (_coincidencia, prefijo: string, sufijo: string) => `${prefijo}${precio}${sufijo}`
        )
        .replace(
          /(por las ).*?( horas dictadas en el referido curso)/,
          (_coincidencia, prefijo: string, sufijo: string) => `${prefijo}${duracion}${sufijo}`
        );
    }
  }

  private formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const partes = fecha.split('-');
    if (partes.length !== 3) return fecha;
    const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const dia = parseInt(partes[2], 10);
    const mes = meses[parseInt(partes[1], 10) - 1];
    const anio = partes[0];
    return `${dia} de ${mes} de ${anio}`;
  }

  cargarFormatos9(): void {
    this.modulosService.obtenerFormatos9({ fx: 'getformato9', d: {} }).subscribe({
      next: (respuesta: any) => {
        if (Array.isArray(respuesta?.data?.item)) {
          this.formatos9Guardados = respuesta.data.item;
          this.seleccionarModulo();
        }
      },
      error: () => {}
    });
  }

  agregarTextoContrato(): void {
    this.textosContrato.push({
      id: this.siguienteTextoId++,
      texto: ''
    });
  }

  eliminarTextoContrato(id: number): void {
    this.textosContrato = this.textosContrato.filter((texto) => texto.id !== id);
  }

  trackByTextoContrato(index: number, texto: { id: number }): number {
    return texto.id;
  }

  guardarFormato9(): void {
    const textos = this.textosContrato.map((texto) => texto.texto);
    if (!this.formato6SeleccionadoCodigo || !this.formato6ModuloId) {
      Swal.fire('Datos incompletos', 'Selecciona el curso definido y el módulo.', 'warning');
      return;
    }
    if (!textos.some((texto) => texto.trim() !== '')) {
      Swal.fire('Contrato vacío', 'Escribe el contenido del contrato antes de guardar.', 'warning');
      return;
    }

    this.guardando = true;
    this.modulosService.insertarFormato9({
      fx: 'insertformato9',
      d: {
        formato6Codigo: this.formato6SeleccionadoCodigo,
        formato6ModuloId: this.formato6ModuloId,
        textos
      }
    }).subscribe({
      next: (respuesta: any) => {
        this.guardando = false;
        if (!respuesta?.data?.success) {
          Swal.fire('Error', respuesta?.data?.message || 'No se pudo guardar el Formato 9.', 'error');
          return;
        }
        // Marcar como existente para que el botón cambie a "Actualizar"
        const yaRegistrado = this.formatos9Guardados.some(
          (f) =>
            Number(f.formato6_codigo) === Number(this.formato6SeleccionadoCodigo) &&
            Number(f.formato9_modulo_id) === Number(this.formato6ModuloId)
        );
        if (!yaRegistrado && this.formato6SeleccionadoCodigo && this.formato6ModuloId) {
          this.formatos9Guardados.push({
            formato9_codigo: respuesta.data.item?.[0]?.formato9_codigo ?? 0,
            formato6_codigo: this.formato6SeleccionadoCodigo,
            formato9_modulo_id: this.formato6ModuloId
          });
        }
        this.yaExiste = true;
        const titulo = (respuesta.data.message || '').toLowerCase().includes('actualiz') ? 'Actualizado' : 'Guardado';
        Swal.fire(titulo, respuesta.data.message || 'El Formato 9 se guardó correctamente.', 'success');
      },
      error: (error: any) => {
        this.guardando = false;
        console.error('Error al guardar el Formato 9:', error);
        Swal.fire('Error', 'No se pudo guardar el Formato 9.', 'error');
      }
    });
  }

  cargarCursosFormato6(): void {
    this.cargandoCursos = true;
    this.modulosService.obtenerFormato6({
      fx: 'getformato6',
      d: { incluirInactivos: true },
      dpro: 0,
      dus: 0,
      dcx: 1
    }).subscribe({
      next: (respuesta: any) => {
        this.cargandoCursos = false;
        if (!respuesta?.data?.success || !Array.isArray(respuesta.data.item)) {
          this.cursosFormato6 = [];
          Swal.fire(
            'Error',
            respuesta?.data?.message || 'No se pudieron cargar los cursos del Formato 6.',
            'error'
          );
          return;
        }

        this.cursosFormato6 = respuesta.data.item.filter(
          (curso: any) => Array.isArray(curso?.modulos) && curso.modulos.length > 0
        );
      },
      error: (error: any) => {
        this.cargandoCursos = false;
        this.cursosFormato6 = [];
        console.error('Error al cargar cursos para el Formato 9:', error);
        Swal.fire('Error', 'No se pudieron cargar los cursos del Formato 6.', 'error');
      }
    });
  }
}

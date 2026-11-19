import type { FaqCategory, FaqItem } from '../types/faqTypes';

export const FAQ_CATEGORIES: FaqCategory[] = [
  { id: 'all', name: 'Todas las Preguntas' },
  { id: 'digital', name: 'Bases de Datos & Intranet' },
  { id: 'lab', name: 'Laboratorio & Computadoras' },
  { id: 'prestamos', name: 'Préstamos & Devoluciones' },
  { id: 'tramites', name: 'Trámites & Constancias' },
  { id: 'investigacion', name: 'Investigación' },
  { id: 'horarios', name: 'Horarios & Feriados' },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    category: 'digital',
    question: '¿Cómo accedo a las bases de datos desde mi casa, u otros ambientes?',
    answerHtml: `<p>Para acceder a las bases de datos suscritas por la facultad fuera del campus universitario:</p>
<ol class="list-decimal pl-5 my-2 space-y-1.5 text-slate-600">
  <li><strong class="text-[#0F172A]">Registro inicial obligatorio:</strong> La primera vez que ingreses, debes registrarte a través de la red de la universidad o mediante la <strong class="text-[#0F172A]">Intranet URP</strong> (<span class="font-sans font-medium text-[#008744]">intranet.urp.edu.pe</span>).</li>
  <li><strong class="text-[#0F172A]">Ruta en la Intranet:</strong> Dentro de tu sesión de Intranet, dirígete a la sección <strong class="text-[#0F172A]">Servicios</strong>, donde se desplegarán varias opciones; selecciona <strong class="text-[#0F172A]">BASES DE DATOS MEDICAS</strong>.</li>
  <li><strong class="text-[#0F172A]">Creación de credenciales:</strong> En este primer acceso, crea tu cuenta y contraseña personal en el servicio correspondiente.</li>
  <li><strong class="text-[#0F172A]">Accesos posteriores:</strong> Una vez registrada tu cuenta institucional por primera vez, ya puedes ingresar directamente a la plataforma en cualquier momento y desde cualquier ambiente, <strong class="text-[#0F172A]">sin necesidad de ingresar nuevamente por la Intranet</strong>.</li>
</ol>`,
  },
  {
    id: 2,
    category: 'digital',
    question: '¿Por qué una base de datos me pide pagar o suscribirme al intentar leer un artículo?',
    answerHtml: `<p>Esto ocurre cuando se intenta ingresar directamente a una plataforma sin antes haberse registrado por primera vez a través de la Intranet dentro de la red (internet) de la universidad:</p>
<ul class="list-disc pl-5 my-2 space-y-1.5 text-slate-600">
  <li>Los servidores del proveedor no reconocen tu vinculación institucional si tu cuenta no ha sido activada previamente mediante la Intranet dentro de la red (internet) de la universidad.</li>
  <li><strong class="text-[#0F172A]">Solución:</strong> Sigue el flujo de registro inicial: entra a tu <strong class="text-[#0F172A]">Intranet URP</strong>, ve a <strong class="text-[#0F172A]">Servicios</strong>, selecciona <strong class="text-[#0F172A]">BASES DE DATOS MEDICAS</strong> y completa el registro de tu cuenta. A partir de ese momento, podrás acceder a los contenidos suscritos con tus credenciales creadas.</li>
</ul>`,
  },
  {
    id: 3,
    category: 'digital',
    question: '¿Los residentes pueden acceder a las bases de datos?',
    answerHtml: `<p class="text-slate-600">Sí, los médicos residentes sí pueden y tienen habilitado el acceso a las bases de datos suscritas por la facultad durante la vigencia de su formación académica y rotaciones hospitalarias.</p>`,
  },
  {
    id: 4,
    category: 'lab',
    question: '¿Cómo funciona la duración de la sesión en las computadoras del laboratorio?',
    answerHtml: `<p>El uso de las computadoras del laboratorio se organiza por sesiones:</p>
<ul class="list-disc pl-5 my-2 space-y-1.5 text-slate-600">
  <li><strong class="text-[#0F172A]">Duración base y flexibilidad:</strong> Al iniciar sesión en una computadora, se asigna un tiempo inicial de <strong class="text-[#0F172A]">3 horas</strong>. Este límite no es restrictivo; al agotarse el tiempo, el sistema desplegará dos opciones en pantalla: <strong class="text-[#0F172A]">extender tu sesión por 3 horas más</strong> o <strong class="text-[#0F172A]">finalizarla</strong>.</li>
  <li><strong class="text-[#0F172A]">Propósito:</strong> Esta dinámica permite recopilar estadísticas institucionales sobre el uso de los equipos sin interrumpir tus actividades académicas.</li>
  <li><strong class="text-[#0F172A]">Pausas:</strong> Si debes salir temporalmente a clases o refrigerio, puedes cerrar tu sesión para que otro estudiante pueda usar el equipo; al volver podrás iniciar una nueva sesión.</li>
</ul>`,
  },
  {
    id: 5,
    category: 'lab',
    question: '¿Está permitido ingresar con alimentos o bebidas a la sala de lectura y computadoras?',
    answerHtml: `<ul class="list-disc pl-5 my-2 space-y-1.5 text-slate-600">
  <li><strong class="text-[#0F172A]">Alimentos terminantemente prohibidos:</strong> Todo tipo de comida está terminantemente prohibido dentro de la biblioteca. Incurrir en esto constituye una falta al reglamento, y es <strong class="text-[#0F172A]">aún más grave consumir alimentos frente a las computadoras</strong>, ya que además de no respetar las normas, se pone en riesgo el equipamiento y se malogra el hardware y los periféricos.</li>
  <li><strong class="text-[#0F172A]">Bebidas:</strong> Únicamente se permite el ingreso y consumo de agua en <strong class="text-[#0F172A]">botellas con tapa</strong>, a fin de prevenir cualquier derrame accidental.</li>
</ul>`,
  },
  {
    id: 6,
    category: 'lab',
    question: '¿Puedo llevar mi propia laptop o tablet y hay tomas de corriente disponibles?',
    answerHtml: `<p>Sí, puedes traer tus propios dispositivos para estudiar en sala, teniendo en cuenta lo siguiente:</p>
<ul class="list-disc pl-5 my-2 space-y-1.5 text-slate-600">
  <li><strong class="text-[#0F172A]">Disponibilidad limitada de enchufes:</strong> La sala cuenta con tomacorrientes disponibles, pero son limitados y suelen ocuparse con rapidez en horas de alta afluencia.</li>
  <li><strong class="text-[#0F172A]">Recomendación:</strong> Se exhorta a los estudiantes a traer sus laptops, tablets y teléfonos celulares <strong class="text-[#0F172A]">previamente cargados</strong> para evitar inconvenientes durante sus jornadas de estudio.</li>
</ul>`,
  },
  {
    id: 7,
    category: 'prestamos',
    question: '¿Cuáles son las políticas y plazos de préstamo de libros?',
    answerHtml: `<p>Los préstamos se gestionan y registran de forma automática mediante el sistema informático de la biblioteca bajo dos modalidades:</p>
<ul class="list-disc pl-5 my-2 space-y-1.5 text-slate-600">
  <li><strong class="text-[#0F172A]">Préstamo a domicilio:</strong> Brinda usualmente un plazo de <strong class="text-[#0F172A]">3 a 4 días</strong>. Para poder retirar libros fuera de las instalaciones, es <strong class="text-[#0F172A]">obligatorio dejar tu carnet universitario físico</strong> en el módulo de atención al encargado de ese turno.</li>
  <li><strong class="text-[#0F172A]">Préstamo en sala:</strong> Permite consultar los libros exclusivamente en el interior de la biblioteca hasta la hora de cierre del servicio (<strong class="text-[#0F172A]">9:00 pm de lunes a viernes</strong> y <strong class="text-[#0F172A]">2:00 pm los sábados</strong>). Para esta modalidad, <strong class="text-[#0F172A]">también es obligatorio dejar el carnet universitario físico</strong> en el módulo de atención. Está terminantemente prohibido retirar de la sala los libros solicitados bajo esta modalidad, ya que son de lectura exclusiva en los interiores de la biblioteca.</li>
</ul>`,
  },
  {
    id: 8,
    category: 'prestamos',
    question: '¿Qué sucede si entrego un libro con retraso?',
    answerHtml: `<p>Si no devuelves el material en la fecha y hora indicadas:</p>
<ul class="list-disc pl-5 my-2 space-y-1.5 text-slate-600">
  <li><strong class="text-[#0F172A]">Suspensión automática:</strong> El sistema genera una suspensión automática de tus derechos de préstamo de libros.</li>
  <li><strong class="text-[#0F172A]">Deuda monetaria acumulativa:</strong> Por cada día de retraso en la entrega, se va acumulando una penalidad económica. Para conocer el monto exacto de la deuda acumulada, debes consultar presencialmente al personal encargado en el módulo de atención durante su turno de atención.</li>
</ul>`,
  },
  {
    id: 9,
    category: 'prestamos',
    question: '¿Cómo puedo renovar el préstamo de un libro?',
    answerHtml: `<p>Para renovar el préstamo de un ejemplar:</p>
<ul class="list-disc pl-5 my-2 space-y-1.5 text-slate-600">
  <li>El trámite se realiza <strong class="text-[#0F172A]">únicamente de manera presencial</strong> acercándote al módulo de atención de la biblioteca con el libro en mano.</li>
  <li>Debe solicitarse antes de la fecha y hora de vencimiento del préstamo actual con el encargado del turno correspondiente.</li>
</ul>`,
  },
  {
    id: 10,
    category: 'tramites',
    question: '¿Cómo puedo recuperar un objeto o pertenencia personal que olvidé dentro de la biblioteca?',
    answerHtml: `<ul class="list-disc pl-5 my-2 space-y-1.5 text-slate-600">
  <li><strong class="text-[#0F172A]">Responsabilidad exclusivamente individual:</strong> Todo tipo de pérdida o extravío de pertenencias personales es <strong class="text-[#0F172A]">completa y exclusivamente responsabilidad del estudiante</strong>.</li>
  <li><strong class="text-[#0F172A]">Custodia por consideración institucional:</strong> La biblioteca guarda y custodia los objetos encontrados en las mesas de lectura o computadoras únicamente por consideración y como un apoyo voluntario para ayudar a los estudiantes durante un período de <strong class="text-[#0F172A]">30 días calendario</strong>. Esto no constituye una obligación contractual de la biblioteca ni forma parte de sus funciones formales.</li>
  <li><strong class="text-[#0F172A]">Retiro:</strong> Puedes acercarte al módulo de recepción identificándote y describiendo las características de tu pertenencia para solicitar su entrega.</li>
  <li><strong class="text-[#0F172A]">Deslinde de responsabilidad:</strong> Pasados los 30 días calendario, la biblioteca desocupa el área de custodia para dar espacio a nuevos objetos y <strong class="text-[#0F172A]">ya no se hace responsable</strong> por los artículos no reclamados.</li>
</ul>`,
  },
  {
    id: 11,
    category: 'tramites',
    question: '¿Cómo tramito mi Constancia de No Adeudo de Biblioteca para el bachillerato, internado o titulación?',
    answerHtml: `<p>Para tramitar la Constancia de No Adeudo (que certifica que no mantienes libros pendientes ni multas):</p>
<ul class="list-disc pl-5 my-2 space-y-1.5 text-slate-600">
  <li><strong class="text-[#0F172A]">Por correo:</strong> Escribe un mensaje al correo de atención oficial de la biblioteca (<a href="mailto:biblioteca.medicina@urp.edu.pe" class="text-[#008744] hover:underline font-semibold">biblioteca.medicina@urp.edu.pe</a>), indicando tus nombres completos y código de estudiante.</li>
  <li><strong class="text-[#0F172A]">Presencial:</strong> También puedes acercarte directamente y consultar a cualquiera de los trabajadores del módulo de atención en la sala.</li>
</ul>`,
  },
  {
    id: 12,
    category: 'investigacion',
    question: '¿Qué estilo de citación se exige en la facultad para trabajos de investigación y tesis?',
    answerHtml: `<p class="text-slate-600 leading-relaxed">En concordancia con los estándares internacionales de las ciencias médicas y de la salud, la Facultad de Medicina Humana (FAMURP) exige la aplicación estricta de las <strong class="text-[#0F172A]">Normas de Vancouver</strong> (<em>International Committee of Medical Journal Editors - ICMJE</em>) para la redacción de citas bibliográficas, protocolos, artículos científicos y proyectos de tesis de grado.</p>`,
  },
  {
    id: 13,
    category: 'horarios',
    question: '¿Dónde consulto los días no laborables, feriados o cierres de la sala?',
    answerHtml: `<p>Cualquier modificación o suspensión temporal en la atención (por feriados nacionales, mantenimiento o desinfección) se comunica oportunamente a través de:</p>
<ul class="list-disc pl-5 my-2 space-y-1.5 text-slate-600">
  <li>La <strong class="text-[#0F172A]">página de inicio</strong> de este portal web.</li>
  <li>El <strong class="text-[#0F172A]">correo institucional</strong> de la facultad.</li>
  <li>Un <strong class="text-[#0F172A]">aviso físico impreso</strong> colocado con anticipación en la puerta de ingreso a la biblioteca.</li>
</ul>`,
  },
];

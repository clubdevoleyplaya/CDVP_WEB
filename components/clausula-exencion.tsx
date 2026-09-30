import type { LegalSection } from "@/components/legal-page";

// Texto de la cláusula de exención de responsabilidad entregado por Juli (2026-09-29).
// Se usa en /condicionesservicio y en el aviso que se acepta antes de abrir un plan.
// Si cambia el texto, hay que cambiar también CLAUSE_VERSION en CDVP_Api
// (app/services/plans_service.py) para pedirle a todos que la acepten de nuevo.
export const CLAUSULA_SECTIONS: LegalSection[] = [
  {
    title: "1. Finalidad del programa",
    body: (
      <>
        <p>
          Los programas y planes de entrenamiento ofrecidos bajo el nombre
          comercial Club de Voley Playa tienen fines exclusivamente educativos,
          informativos y de acondicionamiento físico general.
        </p>
        <p>
          El contenido no constituye asesoramiento médico, diagnóstico,
          tratamiento ni prescripción médica personalizada. Los ejercicios y
          recomendaciones no sustituyen la evaluación, supervisión ni las
          indicaciones de un médico, kinesiólogo, fisioterapeuta u otro
          profesional de la salud debidamente cualificado.
        </p>
        <p>
          Antes de comenzar cualquier programa, especialmente si tienes alguna
          condición médica, lesión previa, síntomas, limitación física o
          cualquier otra preocupación relacionada con tu salud, se recomienda
          consultar con un profesional de la salud y obtener la autorización
          correspondiente para realizar actividad física.
        </p>
      </>
    ),
  },
  {
    title: "2. Aceptación y asunción de riesgos",
    body: (
      <>
        <p>
          Al adquirir, acceder o utilizar cualquiera de los programas de
          entrenamiento, reconoces y aceptas que la práctica de actividad física
          y deportiva implica riesgos inherentes, incluso cuando los ejercicios
          se realicen correctamente.
        </p>
        <p>
          Estos riesgos pueden incluir, entre otros, lesiones musculares,
          tendinitis, esguinces, distensiones, lesiones articulares, caídas,
          fracturas, agravamiento de lesiones o condiciones preexistentes y, en
          casos excepcionales, complicaciones cardiovasculares u otros problemas
          de salud.
        </p>
        <p>
          Al participar voluntariamente en el programa, aceptas la
          responsabilidad de realizar los ejercicios de acuerdo con tus propias
          capacidades, límites físicos y condiciones de salud.
        </p>
      </>
    ),
  },
  {
    title: "3. Responsabilidad del usuario",
    body: (
      <>
        <p>
          Es responsabilidad del usuario evaluar sus propias condiciones físicas
          y de salud antes de comenzar y durante la realización del programa.
        </p>
        <p>
          Los ejercicios deben ejecutarse respetando la técnica indicada y
          adaptándose, cuando sea necesario, al nivel de condición física,
          experiencia y capacidades individuales.
        </p>
        <p>
          Si durante la realización de cualquier ejercicio experimentas dolor,
          mareos, dificultad para respirar, malestar, debilidad u otros síntomas
          inusuales, debes interrumpir inmediatamente la actividad y, cuando
          corresponda, consultar con un profesional de la salud.
        </p>
      </>
    ),
  },
  {
    title: "4. Limitación de responsabilidad",
    body: (
      <>
        <p>
          En la medida permitida por la legislación aplicable, Julian Azaad,
          como titular del nombre comercial Club de Voley Playa, no será
          responsable por lesiones, daños o perjuicios que puedan producirse
          como consecuencia del uso de los programas de entrenamiento, salvo en
          aquellos casos en los que dicha responsabilidad no pueda excluirse o
          limitarse legalmente.
        </p>
        <p>
          El usuario reconoce que los programas se proporcionan como una
          herramienta general de entrenamiento y que los resultados pueden
          variar significativamente de una persona a otra.
        </p>
        <p>
          Nada de lo establecido en esta cláusula pretende excluir o limitar
          aquellas responsabilidades que, conforme a la legislación aplicable,
          no puedan ser objeto de exclusión o limitación.
        </p>
      </>
    ),
  },
  {
    title: "5. No sustitución del consejo profesional",
    body: (
      <>
        <p>
          La información contenida en los programas no debe utilizarse para
          diagnosticar, tratar o prevenir enfermedades, lesiones u otras
          condiciones médicas.
        </p>
        <p>
          Si tienes dudas sobre tu estado de salud, capacidad para realizar
          determinados ejercicios o conveniencia de iniciar un programa de
          entrenamiento, debes consultar previamente con un profesional de la
          salud cualificado.
        </p>
      </>
    ),
  },
  {
    title: "6. Uso personal y prohibición de distribución",
    body: (
      <>
        <p>
          Los programas de entrenamiento adquiridos son para uso personal e
          individual del comprador.
        </p>
        <p>
          Queda prohibido copiar, reproducir, modificar, publicar, distribuir,
          revender, compartir, ceder o facilitar el acceso al programa, total o
          parcialmente, a terceros, salvo autorización expresa y por escrito de
          Julian Azaad.
        </p>
      </>
    ),
  },
  {
    title: "7. Adaptaciones y modificaciones",
    body: (
      <>
        <p>
          El usuario reconoce que cada persona presenta diferentes niveles de
          condición física, experiencia, movilidad, fuerza y capacidad de
          recuperación.
        </p>
        <p>
          Por este motivo, puede ser necesario modificar, reducir o suspender
          determinados ejercicios o actividades. Cualquier adaptación deberá
          realizarse de acuerdo con las propias capacidades y, cuando
          corresponda, con la orientación de un profesional cualificado.
        </p>
        <p>
          La realización de los ejercicios queda bajo responsabilidad del
          usuario.
        </p>
      </>
    ),
  },
  {
    title: "8. Resultados",
    body: (
      <>
        <p>
          Los programas de entrenamiento no garantizan resultados específicos de
          rendimiento, composición corporal, pérdida de peso, aumento de masa
          muscular, fuerza, resistencia u otros objetivos.
        </p>
        <p>
          Los resultados dependen de múltiples factores individuales,
          incluyendo, entre otros, condición física inicial, adherencia al
          programa, alimentación, descanso, antecedentes deportivos y
          características individuales.
        </p>
      </>
    ),
  },
  {
    title: "9. Aceptación de los términos",
    body: (
      <>
        <p>
          Al adquirir, acceder o utilizar un programa de entrenamiento de Club
          de Voley Playa, declaras que has leído, comprendido y aceptado las
          presentes condiciones de uso y que eres responsable de determinar, con
          el asesoramiento profesional que corresponda, si el programa resulta
          adecuado para ti.
        </p>
        <p>
          Si no estás de acuerdo con estas condiciones, debes abstenerte de
          utilizar el programa.
        </p>
      </>
    ),
  },
];

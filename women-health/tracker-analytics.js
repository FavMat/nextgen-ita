/**
 * Cuerpo Curativo - Top Analytics Engine (Local/Client-Side)
 * 
 * Este script procesa los datos del Tracker Clínico de la paciente de manera 100% local.
 * NO SE ENVÍAN DATOS AL LLM NI A LA NUBE para garantizar la política de Zero Data Retention.
 * Genera insights estadísticos avanzados, correlaciones y tendencias.
 */

class TrackerAnalytics {
  constructor(painData, fatigueData) {
    this.pain = painData;
    this.fatigue = fatigueData;
    this.length = Math.min(this.pain.length, this.fatigue.length);
  }

  // 1. Correlación de Pearson (Dolor vs Fatiga)
  calculateCorrelation() {
    if (this.length < 2) return 0;
    
    const meanX = this.pain.reduce((a, b) => a + b, 0) / this.length;
    const meanY = this.fatigue.reduce((a, b) => a + b, 0) / this.length;
    
    let num = 0, denX = 0, denY = 0;
    for (let i = 0; i < this.length; i++) {
      const dx = this.pain[i] - meanX;
      const dy = this.fatigue[i] - meanY;
      num += dx * dy;
      denX += dx * dx;
      denY += dy * dy;
    }
    
    if (denX === 0 || denY === 0) return 0;
    return num / Math.sqrt(denX * denY);
  }

  // 2. Cálculo de Tendencias (Últimos 7 días vs Anterior)
  calculateTrend() {
    if (this.length < 14) return { status: 'neutral', message: "Se necesitan más datos para calcular tendencia." };
    
    const currentWeek = this.pain.slice(-7).reduce((a, b) => a + b, 0) / 7;
    const previousWeek = this.pain.slice(-14, -7).reduce((a, b) => a + b, 0) / 7;
    
    const diff = currentWeek - previousWeek;
    
    if (diff > 1) return { status: 'worsening', message: `El dolor promedio ha subido un +${((diff/previousWeek)*100).toFixed(0)}% esta semana.` };
    if (diff < -1) return { status: 'improving', message: `Gran mejora: dolor reducido en un -${Math.abs((diff/previousWeek)*100).toFixed(0)}% respecto a la semana pasada.` };
    return { status: 'stable', message: "Niveles estables de severidad clínica esta semana." };
  }

  // 3. Detección de Ciclicidad (Picos de crisis)
  detectCrisisClusters() {
    let crisisDays = 0;
    let consecutiveCrisis = 0;
    let maxConsecutive = 0;

    for (let i = 0; i < this.length; i++) {
      if (this.pain[i] >= 4) { // 4 o 5 (8-10 dolor)
        crisisDays++;
        consecutiveCrisis++;
        if (consecutiveCrisis > maxConsecutive) maxConsecutive = consecutiveCrisis;
      } else {
        consecutiveCrisis = 0;
      }
    }
    return { totalCrisis: crisisDays, maxDuration: maxConsecutive };
  }

  // 4. Generador de Insights en Lenguaje Natural (100% Local)
  generateClinicalInsights() {
    const corr = this.calculateCorrelation();
    const trend = this.calculateTrend();
    const clusters = this.detectCrisisClusters();
    
    let insightsHtml = `
      <div style="background:var(--white); border:1px solid rgba(61,74,61,.1); border-radius:1rem; padding:1.5rem; margin-top:1.5rem; box-shadow:0 8px 30px rgba(0,0,0,.03);">
        <h4 style="font-family:'Cormorant Garamond',serif; font-size:1.5rem; color:var(--ol); margin-bottom:1rem; display:flex; align-items:center; gap:.5rem;">
          <span style="font-size:1.5rem;">📊</span> Análisis Clínico Local
        </h4>
        <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:1rem;">
    `;

    // Insight de Tendencia
    let trendIcon = trend.status === 'worsening' ? '⚠️' : (trend.status === 'improving' ? '✨' : '⚖️');
    let trendColor = trend.status === 'worsening' ? 'var(--ru)' : (trend.status === 'improving' ? '#27ae60' : 'var(--ol)');
    insightsHtml += `
      <li style="display:flex; gap:1rem; align-items:flex-start;">
        <span style="font-size:1.2rem; background:rgba(61,74,61,.05); padding:.5rem; border-radius:.5rem;">${trendIcon}</span>
        <div>
          <strong style="display:block; color:${trendColor};">Tendencia Semanal</strong>
          <span style="font-size:.9rem; opacity:.8;">${trend.message}</span>
        </div>
      </li>
    `;

    // Insight de Correlación
    let corrMessage = corr > 0.6 
      ? "Fuerte correlación. Tu fatiga crónica se dispara sistemáticamente en los días de mayor dolor pélvico (indicador claro de inflamación sistémica)."
      : (corr < -0.3 ? "Inversa: Tu cuerpo entra en fatiga extrema tras las crisis de dolor (fase de recuperación metabólica)." : "Dolor y fatiga operan en ritmos distintos, sugiere evaluar variables externas.");
    
    insightsHtml += `
      <li style="display:flex; gap:1rem; align-items:flex-start;">
        <span style="font-size:1.2rem; background:rgba(61,74,61,.05); padding:.5rem; border-radius:.5rem;">🔗</span>
        <div>
          <strong style="display:block; color:var(--ol);">Correlación Dolor-Fatiga (${(corr*100).toFixed(0)}%)</strong>
          <span style="font-size:.9rem; opacity:.8;">${corrMessage}</span>
        </div>
      </li>
    `;

    // Insight de Crisis
    insightsHtml += `
      <li style="display:flex; gap:1rem; align-items:flex-start;">
        <span style="font-size:1.2rem; background:rgba(61,74,61,.05); padding:.5rem; border-radius:.5rem;">🚨</span>
        <div>
          <strong style="display:block; color:var(--ol);">Análisis de Brotes</strong>
          <span style="font-size:.9rem; opacity:.8;">Has tenido ${clusters.totalCrisis} días de crisis severa, con un pico máximo de ${clusters.maxDuration} días consecutivos sin alivio.</span>
        </div>
      </li>
    `;

    insightsHtml += `</ul>
      <div style="margin-top:1.5rem; padding-top:1rem; border-top:1px dashed #ddd; font-size:.75rem; color:#999; display:flex; align-items:center; gap:.5rem;">
        🔒 Generado localmente en tu dispositivo. Ningún dato ha sido enviado a la IA.
      </div>
    </div>`;

    return insightsHtml;
  }
}

// Global hook to attach to the UI
window.TrackerAnalyticsEngine = TrackerAnalytics;

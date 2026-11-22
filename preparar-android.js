/* Prepara el proyecto Android para que los avisos funcionen en segundo plano.
   Ejecutar UNA vez, después de "npx cap add android":   node preparar-android.js */
const fs = require('fs');
const path = require('path');

const archivo = path.join(__dirname, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
if (!fs.existsSync(archivo)) {
  console.error('No existe la carpeta android. Ejecuta primero:  npx cap add android');
  process.exit(1);
}

const permisos = [
  'android.permission.POST_NOTIFICATIONS',          // mostrar avisos (Android 13+)
  'android.permission.SCHEDULE_EXACT_ALARM',        // avisos a la hora exacta
  'android.permission.USE_EXACT_ALARM',             // idem, sin pedir permiso aparte (Android 13+)
  'android.permission.RECEIVE_BOOT_COMPLETED',      // reprogramar avisos al reiniciar el teléfono
  'android.permission.WAKE_LOCK',                   // despertar el teléfono para mostrar el aviso
  'android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS' // permitir quitar la restricción de batería
];

let xml = fs.readFileSync(archivo, 'utf8');
const faltan = permisos.filter(p => !xml.includes('android:name="' + p + '"'));

if (faltan.length === 0) {
  console.log('El AndroidManifest.xml ya tenía todos los permisos. No se cambió nada.');
} else {
  const lineas = faltan.map(p => '    <uses-permission android:name="' + p + '" />').join('\n');
  xml = xml.replace(/<application/, lineas + '\n\n    <application');
  fs.writeFileSync(archivo, xml);
  console.log('Permisos agregados (' + faltan.length + '):\n  ' + faltan.join('\n  '));
}

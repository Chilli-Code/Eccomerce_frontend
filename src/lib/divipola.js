import data from "./divipola_municipios.json";

const cities = data;

function toTitleCase(str) {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

const departments = [...new Map(data.map(d => [d.codigoDepartamento, {
  code: d.codigoDepartamento,
  name: toTitleCase(d.departamento),
  lat: d.lat,
  lng: d.lng,
}]))].map(([_, v]) => v).sort((a, b) => a.name.localeCompare(b.name));

export function getDepartments() {
  return departments;
}

export function getCitiesByDepartment(deptName) {
  if (!deptName) return [];
  return cities
    .filter(c => c.departamento === deptName.toUpperCase())
    .map(c => ({ code: c.codigoMunicipio, name: toTitleCase(c.municipio), lat: c.lat, lng: c.lng }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function searchDepartments(query) {
  if (!query) return departments;
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return departments.filter(d =>
    d.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q)
  );
}

export function searchCities(query, deptName) {
  let pool = deptName ? cities.filter(c => c.departamento === deptName.toUpperCase()) : cities;
  if (!query) return pool.map(c => ({ code: c.codigoMunicipio, name: toTitleCase(c.municipio), lat: c.lat, lng: c.lng }));
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return pool
    .filter(c =>
      c.municipio.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q)
    )
    .map(c => ({ code: c.codigoMunicipio, name: toTitleCase(c.municipio), lat: c.lat, lng: c.lng }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function findDepartmentByCity(cityName) {
  if (!cityName) return null;
  const q = cityName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const match = cities.find(c =>
    c.municipio.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === q
  );
  return match ? toTitleCase(match.departamento) : null;
}

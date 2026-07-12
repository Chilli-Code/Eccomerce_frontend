import { useState, useRef, useEffect, useCallback } from "react";
import { searchDepartments, getCitiesByDepartment, findDepartmentByCity } from "../lib/divipola";

function Autocomplete({ value, onChange, placeholder, options, disabled = false }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const ref = useRef(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = options.filter(o =>
    o.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .includes(query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
  );

  function handleSelect(name) {
    setQuery(name);
    onChange(name);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        disabled={disabled}
        onChange={e => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-zinc-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {filtered.map(o => (
            <button
              key={o}
              type="button"
              onMouseDown={() => handleSelect(o)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 transition-colors"
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LocationAutocomplete({
  department,
  city,
  onDepartmentChange,
  onCityChange,
  className = "",
}) {
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    if (department) {
      setCityOptions(getCitiesByDepartment(department).map(c => c.name));
    } else {
      setCityOptions([]);
    }
  }, [department]);

  const prevDepartmentRef = useRef(department);
  useEffect(() => {
    const prev = prevDepartmentRef.current;
    prevDepartmentRef.current = department;
    if (prev && department !== prev && city) {
      const validCities = getCitiesByDepartment(department).map(c => c.name.toLowerCase());
      if (!validCities.includes(city.toLowerCase())) {
        onCityChange("");
      }
    }
  }, [department]);

  function handleCityChange(val) {
    onCityChange(val);
    if (val && !department) {
      const dept = findDepartmentByCity(val);
      if (dept) onDepartmentChange(dept);
    }
  }

  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      <Autocomplete
        value={department}
        onChange={onDepartmentChange}
        placeholder="Departamento"
        options={searchDepartments().map(d => d.name)}
      />
      <Autocomplete
        value={city}
        onChange={handleCityChange}
        placeholder="Ciudad"
        options={cityOptions}
        disabled={!department}
      />
    </div>
  );
}

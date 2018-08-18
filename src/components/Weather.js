import React from "react";
import "./Weather.css";

export default ({
  data,
  ...props
}) =>
  <div {...props}>
    {data && <p class="lonlat" > {data.name} </p>}
    {data.coord && <p class="lonlat" > (lon: {data.coord.lon}, lat:{data.coord.lat}) </p>}
    {data.weather && <img class="icon" src={data.weather[0].icon} alt="whether"/>}
    {data.main && <div class="temp"> {data.main.temp} </div>} <br/>
  </div>
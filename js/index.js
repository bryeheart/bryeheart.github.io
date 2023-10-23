/**
 * 目标1：默认显示-北京市天气
 *  1.1 获取北京市天气数据
 *  1.2 数据展示到页面
 */
function getWeather(cityCode) {
  myAxios({
    url: 'https://hmajax.itheima.net/api/weather',
    method: 'GET',
    params: {
      city: cityCode
    }
  }).then(res => {
    console.log(res);
    const weatherObj = res.data
    console.log(weatherObj);
    // 将农历和阳历日期放在title中
    const titleDom = document.querySelector('.title')
    titleDom.innerHTML = `<span class="dateShort">${weatherObj.dateShort}</span>
        <span class="calendar">农历&nbsp;
          <span class="dateLunar">${weatherObj.dateLunar}</span>
        </span>`
    // 城市名
    const areaBox = document.querySelector('.area')
    areaBox.innerHTML = `<span class="area">${weatherObj.area}</span>`
    // 将温度插入
    const temperatureBox = document.querySelector('.temperature')
    temperatureBox.innerHTML = `<span class="temperature">${weatherObj.temperature}</span>`
    // psPm25、psPm25Level
    const airBox = document.querySelector('.air')
    airBox.innerHTML = `<span class="psPm25">${weatherObj.psPm25}</span>
        <span class="psPm25Level">${weatherObj.psPm25Level}</span>`
    // 天气（天气 风速）
    const weatherListBox = document.querySelector('.weather-list')
    weatherListBox.innerHTML = `<li>
        <img src=${weatherObj.weatherImg}} class="weatherImg" alt="">
        <span class="weather">${weatherObj.weather}</span>
      </li>
      <li class="windDirection">${weatherObj.windDirection}</li>
      <li class="windPower">${weatherObj.windPower}</li>
    </ul>`
    // 今日天气
    const todayWeatherBox = document.querySelector('.today-weather')
    todayWeatherBox.innerHTML = `<div class="range-box">
        <span>今天：</span>
        <span class="range">
          <span class="weather">${weatherObj.todayWeather.weather}</span>
          <span class="temNight">${weatherObj.todayWeather.temNight}</span>
          <span>-</span>
          <span class="temDay">${weatherObj.todayWeather.temDay}</span>
          <span>℃</span>
        </span>
      </div>
      <ul class="sun-list">
        <li>
          <span>紫外线</span>
          <span class="ultraviolet">${weatherObj.todayWeather.ultraviolet}</span>
        </li>
        <li>
          <span>湿度</span>
          <span class="humidity">${weatherObj.todayWeather.humidity}</span>%
        </li>
        <li>
          <span>日出</span>
          <span class="sunriseTime">${weatherObj.todayWeather.sunriseTime}</span>
        </li>
        <li>
          <span>日落</span>
          <span class="sunsetTime">${weatherObj.todayWeather.sunsetTime}</span>
        </li>
      </ul>`

    //   接下来是七日内天气预报，可以循环，所以可以用map
    const forecast = weatherObj.dayForecast
    console.log(forecast);
    const theLi = forecast.map(everyDay => {
      return `<li class="item">
            <div class="date-box">
              <span class="dateFormat">${everyDay.dateFormat}</span>
              <span class="date">${everyDay.date}</span>
            </div>
            <img src=${everyDay.weatherImg}} alt="" class="weatherImg">
            <span class="weather">${everyDay.weather}</span>
            <div class="temp">
              <span class="temNight">${everyDay.temNight}</span>-
              <span class="temDay">${everyDay.temDay}</span>
              <span>℃</span>
            </div>
            <div class="wind">
              <span class="windDirection">${everyDay.windDirection}</span>
              <span class="windPower">${everyDay.windPower}</span>
            </div>
          </li>`
    }).join('')
    const weekWrapBox = document.querySelector('.week-wrap')
    weekWrapBox.innerHTML = theLi
  }).catch(err => {
    console.log(err)
  })
}
getWeather("110100")

const listBox = document.querySelector('.search-list')

// 监听用户输入实时反馈城市列表
document.querySelector('.search-city').addEventListener('input', (e) => {
  console.dir(e.target.value);
  myAxios({
    url: 'https://hmajax.itheima.net/api/weather/city',
    method: 'GET',
    params: {
      city: e.target.value
    }
  }).then(res => {
    console.log(res.data);
    // 获取到城市了就返回到列表
    if (e.target.value) {
      const theLi = res.data.map(item => {
        return `<li data-id="${item.code}" class="city-item">${item.name}</li>`
      }).join('')
      // console.log(theLi);
      listBox.innerHTML = theLi
    }

  }).catch(err => {
    console.log(err);
  })
})

//返回之后添加点击事件
listBox.addEventListener('click', e => {
  console.log(e.target.dataset.id);
  if (e.target.classList.contains('city-item')) {
    // 获取点击li的ID 执行getWeather
    getWeather(e.target.dataset.id)
  }
});

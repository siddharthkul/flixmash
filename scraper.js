const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://www.imsdb.com";

scrapeAllTranscripts = url => {
  axios(url + "/all%20scripts/")
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      let moviesTable = $("tbody").find("p");
      moviesTable
        .find("a")
        .toArray()
        .forEach(item => {
          scrapeTranscript(url, url + item.attribs.href);
        });
    })
    .catch(console.error);
};

scrapeTranscript = (baseUrl, url) => {
  axios(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      let linksList = $(".script-details tr:nth-child(2)").find("td");
      let movie = {};
      movie.writers = [];
      movie.genres = [];
      linksList.each((i, item) => {
        // image + name
        if (i == 0) {
          img = $(item)
            .find("img")
            .toArray();
          img.forEach(innerItem => {
            let title = (innerItem.attribs.title.split(" "))
            title = title.slice(0, title.length-1).join(" ");
            movie.name = title;
            movie.cover = baseUrl + innerItem.attribs.src;
          });
        }
        // writers + genres + linkToTranscript
        if (i == 1) {
          let anchor = $(item)
            .find("a")
            .toArray();
          for (let i = 0; i < anchor.length - 2; i++) {
            let result = (anchor[i].attribs.title.split(" "));
            if(result[0]=="Scripts"){
              movie.writers.push(result.splice(2,result.length-1).join(" "))
            }else{
              movie.genres.push(result[0])
            }
          }
          // transcript link
          linkToTranscript = baseUrl + anchor[anchor.length - 1].attribs.href;
          console.log(linkToTranscript)
        }
      });
      // console.log(movie);
    })
    .catch(console.error);
};

getCover = title => {};

scrapeAllTranscripts(url);

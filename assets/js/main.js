---
---

$(document).ready(function () {
  handleUrlParams()
});


// Function declarations below

function handleUrlParams() {
  params = new URLSearchParams(window.location.search);
  awardImageParam = getAwardImageParam()

  for(var entry of params.entries()) {
    if (entry[0] == "app") {
        makeSiteUserFacing(entry[1])
    }
  }

  console.log(awardImageParam)
  handleAwardImages("?" + awardImageParam)
  changeScoreParameterInBadgeSrc(awardImageParam)
  persistUrlParameters()
}

function getAwardImageParam() {
  params = new URLSearchParams(window.location.search);
  awardImageParam = "3"
  for(var entry of params.entries()) {
    console.log(entry[0])
    if (/\??\d/.test(entry[0])) {
      awardImageParam = entry[0]
      if (entry[0].length > 1) {
        awardImageParam = entry[0].substring(1,2)
      }
    }
  }
  console.log(awardImageParam)
  return awardImageParam
}

function makeSiteUserFacing(appName) {
  // Turn all [your app] mentions into specific app
  findAndReplaceDOMText(document.body, {
      find: new RegExp('[\\[ ]your app[.,?! \\]]', 'gi'),
      replace: " " + appName + " ",
      preset: 'prose'
    }
  );

  // Hide Story and Dev solution section + hide menu
  $('#vendor-menu').hide()
  $('#apidoc').hide()
  $('#contribute').hide()
  $('#explanation-section').hide()
  $('#developer-solution-section').hide()
  $('#badge-section').hide()
  $('#customization-links').hide()

  // Hide Contribute button on vendor page
  $('#vendor-btn-contribute').hide()

  solutionTitle = $('#user-solution-title').contents().last()[0]
  if (solutionTitle) { solutionTitle.textContent=' Solution' }
}



function persistUrlParameters() {
  urlParams = new URLSearchParams(window.location.search)
  console.log("presisting")
  $('a').each(function () {
    if (this.host === window.location.host && this.href.indexOf('#') === -1) {
      if (this.className == "customization-switch-link") {
        //console.log(this.href)
      } else {
        this.href = this.href + window.location.search
      }
    }
  });
}

function handleAwardImages(awardImageParam) {
  scoreCustomization = []
  {% for img in site.data.award_images %}
    addBadgeImage({{ img.parameter }}, {{ img.emptyImg }}, {{ img.fullImg }}, {{ img.attribution }})
  {% endfor %}

  var arrayLength = scoreCustomization.length;
  for (var i = 1; i < arrayLength; i++) {
    currentHtml = $('#customization-links').html()
    $('#customization-links').html(currentHtml + '<a class="customization-switch-link" href="' + window.location.pathname + scoreCustomization[i].param + '"><img class="customization-switch" src="' + scoreCustomization[i].fullScore + '"></a>')
  }

  var currentScoreCustomization = scoreCustomization.filter(obj => {
    return obj.param === awardImageParam
  })
  changeScoreImages(currentScoreCustomization[0].emptyScore, currentScoreCustomization[0].fullScore)
  attributeIcon(currentScoreCustomization[0].attribution)
  //addScoreParameterToAllLocalLinks(awardImageParam)
}

function addBadgeImage(parameter, emptyScore, fullScore, attribution) {
  scoreCustomization.push({
    'param': parameter,
    'emptyScore': "/assets/img/" + emptyScore,
    'fullScore': "/assets/img/" + fullScore,
    'attribution': attribution
  })
}
function attributeIcon(author) {
  document.getElementById('icons-attribution').innerHTML = author
}
function addScoreParameterToAllLocalLinks(parameter) {
  $('a').each(function () {
    if (this.host === window.location.host && this.className != "customization-switch-link" && this.href.indexOf('#') ===
    -1) {
      this.href = this.href + parameter;
    }
  });
}
function changeScoreImages(imgRelativePathEmptyScore, imgRelativePathFullScore) {
  $('.score-empty').each((i, score) => {
    $(score).attr('src', imgRelativePathEmptyScore)
  })
  $('.score-full').each((i, score) => {
    $(score).attr('src', imgRelativePathFullScore)
  })
}

function changeScoreParameterInBadgeSrc(parameter) {
  $('#badge-shareable').attr('src', 'https://dontkillmyapp.com/badge' + window.location.pathname + parameter
  + '.svg')
}

function hideBadge() {
  $('#badge').hide()
}

function copyEmbedToClipboard() {
  const el = document.createElement('textarea');
  el.value = document.getElementById("embed").innerHTML
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

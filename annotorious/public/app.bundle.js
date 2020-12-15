/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/annotation.js":
/*!***************************!*
  !*** ./src/annotation.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "anno": () => /* binding */ anno
/* harmony export */ });
/* harmony import */ var _pdf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pdf */ "./src/pdf.js");
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./functions */ "./src/functions.js");


let anno;

(function () {
  anno = Annotorious.init({
    image: "the-canvas",
    locale: "auto" // comment: true,
    // headless:true

  });
  anno.on("selectAnnotation", function (annotation) {});
  anno.on("createAnnotation", function (annotation) {
    console.log("created", annotation);
    annotation.pageNum = _pdf__WEBPACK_IMPORTED_MODULE_0__.pageNum;
    let normalizeAnno = (0,_functions__WEBPACK_IMPORTED_MODULE_1__.normalizeCords)(annotation);
  });
  anno.on("updateAnnotation", function (annotation, previous) {
    console.log("updated", annotation);
  });
  anno.on("deleteAnnotation", function (annotation) {
    console.log("deleted", annotation);
  });
  anno.setDrawingTool("rect");
})();



/***/ }),

/***/ "./src/functions.js":
/*!**************************!*
  !*** ./src/functions.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "normalizeCords": () => /* binding */ normalizeCords,
/* harmony export */   "deNormalizeCords": () => /* binding */ deNormalizeCords
/* harmony export */ });
const normalizeCords = ano => {
  let width = document.getElementById("the-canvas").width;
  let height = document.getElementById("the-canvas").height;
  let data = ano.target.selector.value.split(":")[1].split(",");
  let cor = {};
  cor.wmin = Number(data[0] / width);
  cor.hmin = Number(data[1] / height);
  cor.wmax = Number(data[2] / width);
  cor.hmax = Number(data[3] / height);
  ano.normal = cor;
  return ano;
};
const deNormalizeCords = allAnno => {
  let width = document.getElementById("the-canvas").width;
  let height = document.getElementById("the-canvas").height;
  return allAnno.map(ano => {
    var d = ano.normal;
    var cor = {};
    cor.x = Number(d.wmin * width);
    cor.y = Number(d.hmin * height);
    cor.w = Number(d.wmax * width);
    cor.h = Number(d.hmax * height);
    var d = `xywh=pixel:${cor.x},${cor.y},${cor.w},${cor.h}`;
    ano.target.selector.value = d;
    return ano;
  });
};

/***/ }),

/***/ "./src/index.js":
/*!**********************!*
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pdf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pdf */ "./src/pdf.js");

$(document).ready(function () {
  $("#back").on("click", function () {
    window.location.href = "index.html";
  });
});

/***/ }),

/***/ "./src/pdf.js":
/*!********************!*
  !*** ./src/pdf.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pageNum": () => /* binding */ pageNum
/* harmony export */ });
/* harmony import */ var _annotation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./annotation */ "./src/annotation.js");
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./functions */ "./src/functions.js");



const deleteAllAnno = () => {
  let allAnno = _annotation__WEBPACK_IMPORTED_MODULE_0__.anno.getAnnotations();
  allAnno.map(ano => _annotation__WEBPACK_IMPORTED_MODULE_0__.anno.removeAnnotation(ano));
};

var url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'; // Loaded via <script> tag, create shortcut to access PDF.js exports.

var pdfjsLib = window['pdfjs-dist/build/pdf']; // The workerSrc property shall be specified.

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';
var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1,
    canvas = document.getElementById('the-canvas'),
    ctx = canvas.getContext('2d');
/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */

function renderPage(num) {
  pageRendering = true; // Using promise to fetch the page

  pdfDoc.getPage(num).then(function (page) {
    var viewport = page.getViewport({
      scale: scale
    });
    canvas.height = viewport.height;
    canvas.width = viewport.width; // Render PDF page into canvas context

    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    var renderTask = page.render(renderContext); // Wait for rendering to finish

    renderTask.promise.then(function () {
      pageRendering = false;

      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  }); // Update page counters
  // document.getElementById('page_num').textContent = num;

  document.getElementById('pageNum').value = num;
}
/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */


function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}
/**
 * Displays previous page.
 */


function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }

  pageNum--;
  deleteAllAnno();
  queueRenderPage(pageNum);
}

document.getElementById('prev').addEventListener('click', onPrevPage);
/**
 * Displays next page.
 */

function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }

  pageNum++;
  deleteAllAnno();
  queueRenderPage(pageNum);
}

document.getElementById('next').addEventListener('click', onNextPage);

const pdfRender = pdf => {
  /**
   * Asynchronously downloads PDF.
   */
  pdfjsLib.getDocument(pdf).promise.then(function (pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById('page_count').textContent = pdfDoc.numPages; // Initial/first page rendering

    renderPage(pageNum);
  });
};

pdfRender(url);

async function onZoomIn(zoom) {
  let allAnno = _annotation__WEBPACK_IMPORTED_MODULE_0__.anno.getAnnotations();
  scale = scale + zoom;
  await renderPage(pageNum);

  if (allAnno.length > 0) {
    allAnno.map(ano => _annotation__WEBPACK_IMPORTED_MODULE_0__.anno.removeAnnotation(ano));
    allAnno = (0,_functions__WEBPACK_IMPORTED_MODULE_1__.deNormalizeCords)(allAnno);
    _annotation__WEBPACK_IMPORTED_MODULE_0__.anno.loadAnnotations(allAnno.filter(a => a.pageNum === pageNum));
  }
}

document.getElementById("zoom-in").addEventListener("click", function () {
  // if (Date.now() - lastMove > 500) {
  // lastMove = Date.now();
  onZoomIn(0.15); // }
});

async function onZoomOut(zoom) {
  if (scale > 0.6) {
    let allAnno = _annotation__WEBPACK_IMPORTED_MODULE_0__.anno.getAnnotations();
    scale = scale - zoom;
    await renderPage(pageNum);

    if (allAnno.length > 0) {
      allAnno.map(ano => _annotation__WEBPACK_IMPORTED_MODULE_0__.anno.removeAnnotation(ano));
      allAnno = (0,_functions__WEBPACK_IMPORTED_MODULE_1__.deNormalizeCords)(allAnno);
      _annotation__WEBPACK_IMPORTED_MODULE_0__.anno.loadAnnotations(allAnno.filter(a => a.pageNum === pageNum));
    }
  }
}

document.getElementById("zoom-out").addEventListener("click", function () {
  // if (Date.now() - lastMove > 500) {
  // lastMove = Date.now();
  onZoomOut(0.15); // }
});
$("#pageNum").on('change', function () {
  pageNum = Number($(this).val());

  if (pageNum >= pdfDoc.numPages) {
    alert("out of range");
    return;
  }

  deleteAllAnno();
  queueRenderPage(pageNum);
});
$("input[type=file]").on('change', function () {
  // FileReader function for read the file.
  $("#name").html(this.files[0].name);
  var fileReader = new FileReader();
  var base64; // Onload of file read the file content

  fileReader.onload = function (fileLoadedEvent) {
    $("#upload_pdf").addClass("hide");
    $("#pdf").removeClass("hide");
    $("#back").removeClass("hide");
    base64 = fileLoadedEvent.target.result;
    pdfRender(base64);
  };

  fileReader.readAsDataURL(this.files[0]);
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=app.bundle.js.map
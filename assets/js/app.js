const particlesJSON = {
    "particles": {
        "number": {
            "value": 160,
            "density": {
                "enable": true,
                "value_area": 400
            }
        },
        "color": {
            "value": "#008ecc"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 6
            },
            "image": {
                "src": "",
                "width": 100,
                "height": 100
            }
        },
        "opacity": {
            "value": 0.7,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 1,
                "opacity_min": 0,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 4,
                "size_min": 0.3,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 100,
            "color": "#007ecc",
            "opacity": 0.5,
            "width": 2
        },
        "move": {
            "enable": true,
            "speed": 3,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "grab"
            },
            "onclick": {
                "enable": true,
                "mode": "repulse"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 100,
                "line_linked": {
                    "opacity": 0.7
                }
            },
            "repulse": {
                "distance": 100,
                "duration": 0.2
            }
        }
    },
    "retina_detect": true
};
// alert("Loading Particles.js");
particlesJS("particles-js", particlesJSON);
const scroller = new SweetScroll();
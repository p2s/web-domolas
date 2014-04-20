$(function () {

    var actualTimestamp = Math.round(new Date().getTime()  / 1000);
    var lastMidnightTS = actualTimestamp - (actualTimestamp % 86400) + new Date().getTimezoneOffset()*60;
    tsYesterday = lastMidnightTS;
    var lastWeekTS = lastMidnightTS - 86400 * 7;
    $.when($.getJSON('index.php?action=jsonData&start='+tsYesterday),$.getJSON('index.php?action=jsonData&start='+tsYesterday+'&db=d_teleinfo')).then(function(dataJson,dataJsonTeleinfo) {
        Highcharts.setOptions({                                            // This is for all plots, change Date axis to local timezone
            global : {
                useUTC : false
            },
            lang: {
                months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
                shortMonths: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil',
                                'Aout', 'Sept', 'Oct', 'Nov', 'Déc'],
                decimalPoint: ',',
                downloadPNG: 'Télécharger en image PNG',
                downloadJPEG: 'Télécharger en image JPEG',
                downloadPDF: 'Télécharger en document PDF',
                downloadSVG: 'Télécharger en document Vectoriel',
                exportButtonTitle: 'Export du graphique',
                loading: 'Chargement en cours...',
                printButtonTitle: 'Imprimer le graphique',
                rangeSelectorFrom: 'De',
                rangeSelectorTo: 'à',
                resetZoom: 'Réinitialiser le zoom',
                resetZoomTitle: 'Réinitialiser le zoom au niveau 1:1',
                thousandsSep: ' '
            },
            xAxis: {
                dateTimeLabelFormats:{
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%e. %b',
                    week: '%e. %b',
                    month: '%b \'%y',
                    year: '%Y'
                }
            }
        });

        //$('#container').highcharts('StockChart', {
        chart = new Highcharts.StockChart({
            chart: {
                renderTo: 'highchart',
                type: 'spline',
                zoomType: 'xy',
                events: {
                    load: function() {
                        $.when( $.getJSON('index.php?action=jsonData&start='+lastWeekTS+'&db=d_teleinfo'),$.getJSON('index.php?action=jsonData&start='+lastWeekTS)).then(function(ti,th){
                            chart.series[2].setData(ti[0][0],false);
                            chart.series[1].setData(th[0][0]["humi"],false);
                            chart.series[0].setData(th[0][0]["temp"],true);
                        });
                        //$.getJSON('jsonData?start='+tsYesterday+'&db=d_teleinfo' , function(dataJson) {
                        //    chart.series[2].setData(dataJson,true);
                        //});
    
                        //var seriesTemp = this.series[0];
                        //var seriesHumi = this.series[1];
                        //$.getJSON('jsonData?start='+lastWeekTS , function(dataJson) {
                        //    seriesHumi.setData(dataJson["humi"],false);
                        //    seriesTemp.setData(dataJson["temp"],true);
                        //});
                        //console.log("Redrax");
                        //this.redraw();
                        //console.log("Redrawed");
                    }
                }
            },
            rangeSelector: {
                buttons: [{
                    type: 'day',
                    count: 1,
                    text: '1j'                
                }, {
                    type: 'day',
                    count: 3,
                    text: '3j'
                }, {
                    type: 'week',
                    count: 1,
                    text: '1s'
                }],
                selected: 0
            },

            title: {
                text: 'Température et humidité'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
                }//,
                //events : {
                    //afterSetExtremes : afterSetExtremes
                //},
                //minRange: 3600 * 1000
            },
            yAxis: [{ // Primary yAxis
                labels: {
                    formatter: function() {
                        return this.value +'°C';
                    },
                    style: {
                        color: '#AA4643'
                    }
                },
                color: '#AA4643',
                title: {
                    text: 'Température',
                    style: {
                        color: '#AA4643'
                    }
                },
                opposite:true,
                min:0
            }, { // Secondary yAxis
                gridLineWidth: 0,
                title: {
                    text: 'Humidité',
                    style: {
                        color: '#89A54E'
                    }
                },
                color: '#89A54E',
                labels: {
                    formatter: function() {
                        return this.value +' %';
                    },
                    style: {
                        color: '#89A54E'
                    }
                },
                opposite: true,
                min: 0,
                max: 100
            }, { // third yAxis
                gridLineWidth: 0,
                title: {
                    text: 'Electricité',
                    style: {
                        color: '#2f7ed8'
                    }
                },
                color: '#2f7ed8',
                labels: {
                    formatter: function() {
                        return this.value +' W';
                    },
                    style: {
                        color: '##2f7ed8'
                    }
                },
                min:0
            }],
            series: [{
                name: 'Température',
                data:dataJson['0']['0']['temp'],
                yAxis:0,
                color: '#AA4643',
                marker: {
                    enabled: false
                    },
                tooltip: {
                    valueDecimals: 1,
                    valueSuffix: '°C'
               }//,
                //pointInterval: 3600 * 1000

            }, {
                name :'Humidité',
                data:dataJson['0']['0']['humi'],
                yAxis:1,
                color: '#89A54E',
                marker: {
                    enabled: false
                },
                tooltip: {
                    valueDecimals: 0,
                    valueSuffix: '%'
               }//,
                //pointInterval: 3600 * 1000
            }, {
                name :'Electricité',
                data:dataJsonTeleinfo['0']['0'],
                yAxis:2,
                color: '#2f7ed8',
                marker: {
                    enabled: true,
                    radius: 2//,
                    //fillColor : '#00FF00'
                },
                tooltip: {
                    valueDecimals: 0,
                    valueSuffix: 'W'
               }//,
                //pointInterval: 3600 * 1000
            }]
        });
    });

    
});

export default {
  "$schema": "https://vega.github.io/schema/vega/v3.0.json",
  "width": 320,
  "height": 320,
  "data": [
    {
      "name": "data_table",
      "values": [
        {
          "browserFamily": "Chrome",
          "browserMajorVer": "34",
          "percent": 5
        },
        {
          "browserFamily": "Chrome",
          "browserMajorVer": "35",
          "percent": 20
        },
        {
          "browserFamily": "Chrome",
          "browserMajorVer": "36",
          "percent": 10
        },
        {
          "browserFamily": "Chrome Mobile",
          "browserMajorVer": "44",
          "percent": 10
        },
        {
          "browserFamily": "Chrome Mobile",
          "browserMajorVer": "38",
          "percent": 5
        },
        {
          "browserFamily": "Mobile Safari",
          "browserMajorVer": "7",
          "percent": 5
        },
        {
          "browserFamily": "Mobile Safari",
          "browserMajorVer": "8",
          "percent": 5
        },
        {
          "browserFamily": "Mobile Safari",
          "browserMajorVer": "9",
          "percent": 10
        },
        {
          "browserFamily": "IE",
          "browserMajorVer": "10",
          "percent": 10
        },
        {
          "browserFamily": "IE",
          "browserMajorVer": "11",
          "percent": 15
        },
        {
          "browserFamily": "Other",
          "browserMajorVer": "",
          "percent": 5
        }
      ],
      "transform": [
        {
          "type": "collect",
          "sort": {
            "field": [
              "browserFamily",
              "browserMajorVer"
            ],
            "order": [
              "ascending",
              "ascending"
            ]
          }
        }
      ]
    },
    {
      "name": "data_table_pie_inner",
      "source": "data_table",
      "transform": [
        {
          "type": "aggregate",
          "groupby": [
            "browserFamily"
          ],
          "fields": [
            "percent"
          ],
          "ops": [
            "sum"
          ],
          "as": [
            "ff_sum_percent"
          ]
        },
        {
          "type": "pie",
          "field": "ff_sum_percent",
          "as": [
            "ff_inner_startAngle",
            "ff_inner_endAngle"
          ]
        }
      ]
    },
    {
      "name": "data_table_pie_outer",
      "source": "data_table",
      "transform": [
        {
          "type": "pie",
          "field": "percent",
          "as": [
            "ff_outer_startAngle",
            "ff_outer_endAngle"
          ]
        }
      ]
    }
  ],
  "scales": [
    {
      "name": "scale_color",
      "type": "ordinal",
      "range": {
        "scheme": "category10"
      },
      "domain": {
        "data": "data_table",
        "field": "browserFamily"
      }
    }
  ],
  "marks": [
    {
      "name": "mark_inner_ring",
      "type": "arc",
      "from": {
        "data": "data_table_pie_inner"
      },
      "encode": {
        "enter": {
          "x": {
            "signal": "width / 2"
          },
          "y": {
            "signal": "height / 2"
          },
          "fill": {
            "scale": "scale_color",
            "field": "browserFamily"
          },
          "fillOpacity": {
            "value": 0.8
          },
          "stroke": {
            "value": "white"
          },
          "startAngle": {
            "field": "ff_inner_startAngle"
          },
          "endAngle": {
            "field": "ff_inner_endAngle"
          },
          "innerRadius": {
            "value": 0
          },
          "outerRadius": {
            "value": 100
          },
          "tooltip": {
            "signal": "datum['browserFamily'] + ': ' + datum['ff_sum_percent'] + '%'"
          }
        }
      }
    },
    {
      "name": "mark_outer_ring",
      "type": "arc",
      "from": {
        "data": "data_table_pie_outer"
      },
      "encode": {
        "enter": {
          "x": {
            "signal": "width / 2"
          },
          "y": {
            "signal": "height / 2"
          },
          "fill": {
            "scale": "scale_color",
            "field": "browserFamily"
          },
          "fillOpacity": {
            "signal": "min(max(datum['percent'] * 0.04, 0.2), 0.7)"
          },
          "stroke": {
            "value": "white"
          },
          "startAngle": {
            "field": "ff_outer_startAngle"
          },
          "endAngle": {
            "field": "ff_outer_endAngle"
          },
          "innerRadius": {
            "value": 100
          },
          "outerRadius": {
            "value": 130
          }
        }
      }
    },
    {
      "name": "mark_text_os_version",
      "type": "text",
      "from": {
        "data": "data_table_pie_outer"
      },
      "encode": {
        "enter": {
          "text": {
            "signal": "datum['browserMajorVer'] == '' ? '' : 'v.' + datum['browserMajorVer']"
          },
          "x": {
            "signal": "width / 2"
          },
          "y": {
            "signal": "height / 2"
          },
          "radius": {
            "value": 115
          },
          "theta": {
            "signal": "(datum['ff_outer_startAngle'] + datum['ff_outer_endAngle'])/2"
          },
          "fill": {
            "value": "black"
          },
          "font": {
            "value": "Helvetica"
          },
          "fontSize": {
            "value": 12
          },
          "align": {
            "value": "center"
          },
          "baseline": {
            "value": "middle"
          }
        }
      }
    },
    {
      "name": "mark_text_os_percent",
      "type": "text",
      "from": {
        "data": "data_table_pie_outer"
      },
      "encode": {
        "enter": {
          "text": {
            "signal": "datum['percent'] + '%'"
          },
          "x": {
            "signal": "width / 2"
          },
          "y": {
            "signal": "height / 2"
          },
          "radius": {
            "value": 150
          },
          "theta": {
            "signal": "(datum['ff_outer_startAngle'] + datum['ff_outer_endAngle'])/2"
          },
          "fill": {
            "value": "grey"
          },
          "font": {
            "value": "Helvetica"
          },
          "fontSize": {
            "value": 14
          },
          "align": {
            "value": "center"
          },
          "baseline": {
            "value": "middle"
          }
        }
      }
    }
  ],
  "legends": [
    {
      "fill": "scale_color",
      "title": "Web Browser",
      "orient": "right",
      "encode": {
        "symbols": {
          "enter": {
            "fillOpacity": {
              "value": 0.5
            }
          }
        },
        "labels": {
          "update": {
            "text": {
              "field": "value"
            }
          }
        }
      }
    }
  ]
}

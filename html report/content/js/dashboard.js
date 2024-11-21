/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7368421052631579, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "product design  Request"], "isController": false}, {"data": [0.0, 500, 1500, "cloud services Request"], "isController": false}, {"data": [1.0, 500, 1500, "design automation Request-1"], "isController": false}, {"data": [0.5, 500, 1500, "automation Request"], "isController": false}, {"data": [1.0, 500, 1500, "digital assurance Request"], "isController": false}, {"data": [1.0, 500, 1500, "design automation Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "careers Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "digital assurance Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "digital assurance Request-0"], "isController": false}, {"data": [0.0, 500, 1500, "cloud services Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "careers Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "careers Request-2"], "isController": false}, {"data": [0.0, 500, 1500, "Home Request"], "isController": false}, {"data": [1.0, 500, 1500, "cloud services Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "newsroom Request"], "isController": false}, {"data": [0.5, 500, 1500, "blog Request-1"], "isController": false}, {"data": [0.5, 500, 1500, "blog Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "ebook Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "ebook Request-1"], "isController": false}, {"data": [0.5, 500, 1500, "ebook Request"], "isController": false}, {"data": [0.5, 500, 1500, "digital customer expeience Request"], "isController": false}, {"data": [0.5, 500, 1500, "careers Request"], "isController": false}, {"data": [1.0, 500, 1500, "newsroom Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "newsroom Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "product design  Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "product design  Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "digital customer expeience Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "design automation Request"], "isController": false}, {"data": [0.0, 500, 1500, "Home Request-1"], "isController": false}, {"data": [0.5, 500, 1500, "digital customer expeience Request-1"], "isController": false}, {"data": [0.5, 500, 1500, "Home Request-0"], "isController": false}, {"data": [0.0, 500, 1500, "blog Request"], "isController": false}, {"data": [1.0, 500, 1500, "automation Request-1"], "isController": false}, {"data": [0.5, 500, 1500, "partners Request"], "isController": false}, {"data": [0.5, 500, 1500, "automation Request-2"], "isController": false}, {"data": [1.0, 500, 1500, "partners Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "partners Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "automation Request-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 38, 0, 0.0, 606.7631578947369, 157, 2169, 370.0, 1676.0000000000005, 2121.5, 2169.0, 3.290328166940861, 126.20495416269807, 0.6179512295436834], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["product design  Request", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 63.127082011421315, 0.7683613578680203], "isController": false}, {"data": ["cloud services Request", 1, 0, 0.0, 2119.0, 2119, 2119, 2119.0, 2119.0, 2119.0, 2119.0, 0.47192071731949037, 32.810472215667765, 0.13272770174610665], "isController": false}, {"data": ["design automation Request-1", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 120.452880859375, 0.8036295572916666], "isController": false}, {"data": ["automation Request", 1, 0, 0.0, 1093.0, 1093, 1093, 1093.0, 1093.0, 1093.0, 1093.0, 0.9149130832570906, 65.97202367337603, 0.40563529277218663], "isController": false}, {"data": ["digital assurance Request", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 131.71995620546318, 0.6819700118764845], "isController": false}, {"data": ["design automation Request-0", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 2.5295980176211454, 0.6797219162995595], "isController": false}, {"data": ["careers Request-0", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 2.293178013392857, 0.5536760602678571], "isController": false}, {"data": ["digital assurance Request-1", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 277.279632260101, 0.7250236742424242], "isController": false}, {"data": ["digital assurance Request-0", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 2.489794481981982, 0.6466427364864865], "isController": false}, {"data": ["cloud services Request-1", 1, 0, 0.0, 1892.0, 1892, 1892, 1892.0, 1892.0, 1892.0, 1892.0, 0.5285412262156448, 36.457989230972515, 0.07432610993657505], "isController": false}, {"data": ["careers Request-1", 1, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 157.0, 6.369426751592357, 3.284235668789809, 0.7899582006369427], "isController": false}, {"data": ["careers Request-2", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 169.42196800595238, 0.3720238095238095], "isController": false}, {"data": ["Home Request", 1, 0, 0.0, 2169.0, 2169, 2169, 2169.0, 2169.0, 2169.0, 2169.0, 0.4610419548178884, 26.897565842554172, 0.1080567081604426], "isController": false}, {"data": ["cloud services Request-0", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 2.419800884955752, 0.6222345132743363], "isController": false}, {"data": ["newsroom Request", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 88.24374610349126, 0.6283120324189526], "isController": false}, {"data": ["blog Request-1", 1, 0, 0.0, 1055.0, 1055, 1055, 1055.0, 1055.0, 1055.0, 1055.0, 0.9478672985781991, 125.34434241706163, 0.1249629739336493], "isController": false}, {"data": ["blog Request-0", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.5496231155778895, 0.22083071608040203], "isController": false}, {"data": ["ebook Request-0", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 2.436926605504587, 0.6092316513761468], "isController": false}, {"data": ["ebook Request-1", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 132.48697916666666, 0.4176493710691824], "isController": false}, {"data": ["ebook Request", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 79.4452688547486, 0.4946461824953445], "isController": false}, {"data": ["digital customer expeience Request", 1, 0, 0.0, 1041.0, 1041, 1041, 1041.0, 1041.0, 1041.0, 1041.0, 0.9606147934678194, 78.93927113352547, 0.29456352065321806], "isController": false}, {"data": ["careers Request", 1, 0, 0.0, 717.0, 717, 717, 717.0, 717.0, 717.0, 717.0, 1.3947001394700138, 80.82995554393305, 0.5202885285913529], "isController": false}, {"data": ["newsroom Request-1", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 193.71202256944446, 0.6998697916666667], "isController": false}, {"data": ["newsroom Request-0", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 2.3419824660633486, 0.5700296945701357], "isController": false}, {"data": ["product design  Request-1", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 142.12696454678363, 0.885188230994152], "isController": false}, {"data": ["product design  Request-0", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 2.548696748878924, 0.6787766255605381], "isController": false}, {"data": ["digital customer expeience Request-0", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 2.5547572544642856, 0.6844656808035714], "isController": false}, {"data": ["design automation Request", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 56.56604266109785, 0.7365005966587113], "isController": false}, {"data": ["Home Request-1", 1, 0, 0.0, 1582.0, 1582, 1582, 1582.0, 1582.0, 1582.0, 1582.0, 0.6321112515802781, 36.561216024020226, 0.07407553729456384], "isController": false}, {"data": ["digital customer expeience Request-1", 1, 0, 0.0, 816.0, 816, 816, 816.0, 816.0, 816.0, 816.0, 1.2254901960784315, 100.0043083639706, 0.18789253982843138], "isController": false}, {"data": ["Home Request-0", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.8607844716494846, 0.20135309278350516], "isController": false}, {"data": ["blog Request", 1, 0, 0.0, 1652.0, 1652, 1652, 1652.0, 1652.0, 1652.0, 1652.0, 0.6053268765133172, 80.24600862590799, 0.15960767251815983], "isController": false}, {"data": ["automation Request-1", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 162.0, 6.172839506172839, 3.4722222222222223, 0.9102527006172839], "isController": false}, {"data": ["partners Request", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 129.86739309210526, 0.4385964912280702], "isController": false}, {"data": ["automation Request-2", 1, 0, 0.0, 710.0, 710, 710, 710.0, 710.0, 710.0, 710.0, 1.4084507042253522, 99.97799295774648, 0.20906690140845072], "isController": false}, {"data": ["partners Request-1", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 212.45314757947978, 0.36127167630057805], "isController": false}, {"data": ["partners Request-0", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 2.301897321428571, 0.5580357142857143], "isController": false}, {"data": ["automation Request-0", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 2.5364111990950224, 0.6672440610859729], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 38, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

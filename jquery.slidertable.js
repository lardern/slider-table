/**
 * Created by WU-HOME on 2017-09-04.
 */

(function ($) {
    $.fn.slidertable = function (options) {
        var config = {
            id: 'st' + (Math.random() * 1000).toFixed(0),//指定table id，可以据此ID写CSS
            rows: 5, //行数
            showHead: true,
            interval: 3000,//轮播间隔，ms
            speed: 1000,//动画速度,ms
            data: [{id: 1, name: '中国'}, {id: 2, name: '中国'}, {id: 3, name: '中国'}, {id: 4, name: '中国'}, {
                id: 5,
                name: '中国'
            }, {id: 6, name: '中国'}, {id: 7, name: '中国'}, {id: 8, name: '中国'}, {id: 9, name: '中国'}, {
                id: 10,
                name: '中国'
            }, {id: 11, name: '中国'}, {id: 12, name: '中国'}], /*取数地址{String}，或 callback函数{Function},或静态数据{Array}*/
            columns: [{dataIndex: 'id', text: '序号', flex: 1}, {dataIndex: 'name', text: '国家', flex: 2}],//列配置
            rowRender: function (el, columns, data, rowHeight, cls) {
                cls = cls || "";
                var html = ['<div class="tr ' + cls + '" style="height: ' + rowHeight + 'px">'];
                for (var j = 0; j < columns.length; j++) {
                    if (columns[j].columnRender) {
                        html.push(columns[j].columnRender(el, columns[j], data));
                    } else {
                        html.push(this.columnRender(el, columns[j], data));
                    }
                }
                html.push('</div>');
                return html.join('');
            },

            columnRender: function (el, column, data) {
                return '<div class="td text-' + (column.align ? column.align : 'center') + '" style="width:' + column.width + '">' + (data[column.dataIndex] == null ? "" : data[column.dataIndex]) + '</div>';
            }
        };
        var interval = null;
        if (options) {
            $.extend(config, options);
        }
        function loadData(el, data) {
            var html = [];
            var sumFlex = 0;
            var elHeight = $(el).height();
            var rowHeight = elHeight / (config.showHead ? (config.rows + 1) : config.rows);
            html.push('<div id="' + config.id + '" class="table" style="height:' + elHeight + 'px">');
            html.push('<div class="thead" style="display:' + (config.showHead ? 'block' : 'none') + ';">');

            $.each(config.columns, function (index, column) {
                sumFlex += (column.flex ? column.flex : 1);
            });

            html.push('<div class="tr" style="height: ' + rowHeight + 'px">');
            $.each(config.columns, function (index, column) {
                column.width = ((column.flex ? column.flex : 1) * 100 / sumFlex) + '%';
                html.push('<div class="th" style="width:' + column.width + '">' + (column.text == null ? "" : column.text) + '</div>');
            });
            html.push('</div>');
            html.push('</div>');// thead end

            html.push('<div class="tbody">');
            var point = 0;
            for (var i = 0; i < config.rows; i++) {
                var cls = i % 2 ? 'odd' : 'eve';
                html.push(config.rowRender(el, config.columns, data[i], rowHeight, cls));
                point = i;
            }
            html.push('</div>');//tbody end
            html.push('</div>'); //table end
            el.append(html.join(''));
            el.find('.tbody .tr:first').css({
                'margin-top': -rowHeight + 'px'
            });
            el.find('.tbody').css({
                'padding-top': rowHeight + 'px'
            });
            if (config.interval) {
                interval = setInterval(function () {
                    point = point + 1;
                    if (point >= data.length) {
                        point = 0;
                    }
                    var tr = config.rowRender(el, config.columns, data[point], rowHeight, (point % 2 ? 'odd' : 'eve'));
                    //el.find('.tbody .tr:first').animate({marginTop: -rowHeight}, config.speed, "swing", function () {
                    //    this.remove();
                    //});
                    el.find('.tbody .tr:first').animate({marginTop: rowHeight*-2}, config.speed, "swing", function () {
                        this.remove();
                        el.find('.tbody .tr:first').css({
                            'margin-top': -rowHeight + 'px'
                        });
                        //el.find('.tbody .tr').removeClass('eve').removeClass('odd');
                        //el.find('.tbody .tr:even').addClass('eve');
                        //el.find('.tbody .tr:odd').addClass('odd');
                    });
                    el.find('.tbody').append(tr);
                }, config.interval);
                //var totalPage = Math.ceil(data.length / config.rows);
                //var page = 0;
                //interval = setInterval(function () {
                //    var start = page * config.rows;
                //    var end = page * config.rows + config.rows - 1;
                //    if (start > 0) {
                //        el.find('.tbody .tr:lt(' + (start) + ')').animate({height: 0});
                //    }
                //    el.find('.tbody .tr:gt(' + (end) + ')').animate({height: 0});
                //    if (start > 0) {
                //        el.find('.tbody .tr:gt(' + (start - 1) + '):lt(' + (end + 1) + ')').animate({height: rowHeight});
                //    } else {
                //        el.find('.tbody .tr:lt(' + (end + 1) + ')').animate({height: rowHeight});
                //    }
                //    page++;
                //    if (page >= totalPage) {
                //        page = 0;
                //    }
                //}, config.interval);
            }
        }


        return this.each(function () {
            var el = $(this);
            if ($.isArray(config.data)) {
                loadData(el, config.data);
            } else if (typeof config.data == 'function') {
                var data = config.data.call(window, el);
                loadData(el, data);
            } else if (typeof config.data == 'string') {
                $.post(config.data, {
                    rnd: new Date().getTime()
                }, function (data, status) {
                    loadData(el, data);
                }, 'json');
            }
        });
    };
})(jQuery);
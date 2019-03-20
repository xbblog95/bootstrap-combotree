(function ($) {
    //data绑定的key
    var btcombotree = "bootstrapCombotree";
    function combotree(element, options)
    {
        var text = new Array() ;//按钮上的文本
        var value = new Array();//值
        var $Tree;//Tree对象
        var $Button;//button对象
        var $hidden;//隐藏域
        //选择节点
        var checkNode = function (node) {
            var result = options.onBeforeCheck(node);
            if(result == false)
            {
                return;
            }
            if($Button.innerText == options.defaultLable)
            {
                $Button.innerText = '';
            }
            setCheck(node) ;
            setCheckparent(node);
            if (text.length <= options.maxItemsDisplay) {
                $Button.html(text + '<span class="caret"></span>');
                $Button.attr("title", text);
            }
            else {
                $Button.html(text.length + '项被选中  <span class="caret"></span>');
                $Button.attr("title", text.length + '项被选中');
            }
            $hidden.val(value);
            options.onCheck(node);
        };
        //取消选择节点
        var unCheckNode = function (node) {
            var result = options.onBeforeUnCheck(node);
            if(result == false)
            {
                return;
            }
            setUnCheck(node);
            setunCheckparent(node);
            if (text.length == 0) {
                $Button.html(options.defaultLable + '<span class="caret"></span>');
                $Button.attr("title", options.defaultLable);
            }
            else {
                if (text.length <= options.maxItemsDisplay) {
                    $Button.html(text + '<span class="caret"></span>');
                    $Button.attr("title", text);
                }
                else {
                    $Button.html(text.length + '项被选中 <span class="caret"></span>');
                    $Button.attr("title", text.length + '项被选中');
                }
            }
            $hidden.val(value);
            options.onUnCheck(node);
        };
        //被选中的节点
        var selectedNode = undefined;
        var selectNode = function (node) {
            if(options.selectToCheck)
            {
                if(!node.state.checked)
                {
                    checkNode(node);
                }
            }
        };
        var unSelectNode = function (node) {
            if(options.selectToCheck)
            {
                if(node.state.checked)
                {
                    unCheckNode(node);
                }
            }
        };
        function init(target) {
            $(target).empty();
            //写html标签
            if (options.width == undefined) {
                target.innerHTML = '<div class="btn-group">'
                    + '<button type="button" class="btn btn-default dropdown-toggle"   data-toggle="dropdown" title=' + options.defaultLable + '>'
                    + options.defaultLable + '<span class="caret"></span>'
                    + '</button>'
                    + '<input type="hidden" name="' + options.name + '"/> '
                    + '<div class="dropdown-menu" style="width: 400%"></div>'
                    + '</div>';
            }
            else {
                target.innerHTML = '<div class="btn-group">'
                    + '<button type="button" class="btn btn-default dropdown-toggle"  data-toggle="dropdown" title=' + options.defaultLable + '>'
                    + options.defaultLable + '<span class="caret"></span>'
                    + '</button>'
                    + '<input type="hidden" name="' + options.name + '"/> '
                    + '<div class="dropdown-menu" style="width: ' + options.width + 'px;"></div>'
                    + '</div>';
            }
            $Tree = $(target).find(".dropdown-menu");//Tree对象
            $Button = $(target).find("button");//button对象
            $hidden = $(target).find("input[type='hidden']");//隐藏域
            //渲染bootstrap-treeview
            $Tree.treeview({
                data: options.data,
                showIcon: options.showIcon,
                showCheckbox: true,
                onNodeChecked: function (event, node) {
                    checkNode(node);
                },
                onNodeUnchecked: function (event, node) {
                    unCheckNode(node);
                },
                onNodeSelected : function (event, node) {
                    selectNode(node);
                    selectedNode = node;
                },
                onNodeUnselected : function (event, node) {
                    if(selectedNode.id == node.id)
                    {
                        unSelectNode(node);
                    }
                    else
                    {
                        selectedNode = undefined;
                    }

                }
            });
            var dropclick = false;
            // 2016-08-24 此时返回false可以阻止下拉框被隐藏
            // 2016=08-25 此问题解决
            $(target).on('hide.bs.dropdown', function (e) {
                if(dropclick)
                {
                    dropclick = false;
                    return false;
                }
                else
                {
                    return true;
                }
            });
            $Tree.on('click', function () {
                dropclick = true;
            });
        };
        init(element);

        var setCheck  = function (node) {
            $Tree.treeview('checkNode', [$Tree.treeview('getNode', [ node.nodeId, { ignoreCase: true, exactMatch: false }]), { silent: true}]);
            if(node == undefined)
            {
                return;
            }
            else
            {
                if(node.nodes == undefined)
                {
                    if($.inArray(node.id, value) < 0)
                    {
                        value.push(node.id);
                        text.push(node.text);
                    }
                }
                else
                {
                    for(var i = 0; i < node.nodes.length; i++)
                    {
                        setCheck(node.nodes[i]);
                    }
                }
            }
        };
        var setCheckparent = function (node) {
            if(node.parentId == undefined)
            {
                return;
            }
            var pNode = $Tree.treeview('getNode', [ node.parentId, { ignoreCase: true, exactMatch: false } ]);
            $Tree.treeview('checkNode', [ pNode, { silent: true}]);
            setCheckparent(pNode);
        };
        var setUnCheck = function (node) {
            $Tree.treeview('uncheckNode', [ $Tree.treeview('searchById', [ node.id, { ignoreCase: true, exactMatch: false } ]), { silent: true}]);
            if(node == undefined)
            {
                return;
            }
            else
            {
                if(node.nodes == undefined)
                {
                    for(var i = 0; i < value.length; i++)
                    {
                        if (text[i] == node.text) {
                            text.splice(i, 1);
                        }
                        if (value[i] == node.id) {
                            value.splice(i, 1);
                        }
                    }
                }
                else
                {
                    for(var i = 0; i < node.nodes.length; i++)
                    {
                        setUnCheck(node.nodes[i]);
                    }
                }
            }
        };
        var setunCheckparent = function (node) {
            if (node.parentId == undefined) {
                return;
            }
            var pNode = $Tree.treeview('getNode', [node.parentId, {ignoreCase: true, exactMatch: false}]);
            var flag = true;
            for(var i = 0; i < pNode.nodes.length; i++)
            {
                if(pNode.nodes[i].state.checked)
                {
                    flag = false;
                    break;
                }
            }
            if(flag)
            {
                $Tree.treeview('uncheckNode', [ pNode, { silent: true}]);
                setunCheckparent(pNode);
            }
            else
            {
                return;
            }
        };
        this.getValue = function () {
            return value;
        };
        this.setValue = function (param) {
            var arr = param.split(",");
            value.splice(0);
            text.splice(0);
            $Tree.treeview("uncheckAll", { silent: true });//全部不选
            for(var i = 0; i < arr.length; i++)
            {
                var node = $Tree.treeview('searchById', [ arr[i], { ignoreCase: true, exactMatch: false }]);
                if(node !=undefined && node.length != 0)
                {
                    if(!node.nodes)
                    {
                        value.push(arr[i]);
                        text.push(node[0].text);
                    }
                    else
                    {
                        continue;
                    }
                    $Tree.treeview('checkNode', [ node[0], { silent: true}]);
                    var tempNode = node[0];
                    while(true)
                    {
                        if(tempNode.parentId != undefined)
                        {
                            //有父节点
                            //选定该节点，再找其父节点
                            var pNode = $Tree.treeview('getNode', [tempNode.parentId, {ignoreCase: true, exactMatch: false}]);
                            //选中该父节点
                            $Tree.treeview('checkNode', [ pNode, { silent: true}]);
                            tempNode = pNode;
                        }
                        else
                        {
                            break;
                        }
                    }

                }
            }
            if (text.length == 0) {
                $Button.innerHTML = options.defaultLable + '<span class="caret"></span>';
                $Button.attr("title", options.defaultLable);
            }
            else {
                if (text.length <= options.maxItemsDisplay) {
                    $Button.innerHTML = text + '<span class="caret"></span>';
                    $Button.attr("title", text);
                }
                else {
                    $Button.innerHTML = text.length + '项被选中 <span class="caret"></span>';
                    $Button.attr("title", text.length + '项被选中');
                }
            }
            $hidden.val(value);
        }

    }
    function log(msg, logType)
    {
        if(console)
        {
            if(logType === "warning")
            {
                console.warn(msg);
            }
            else if(logType === "error")
            {
                console.error(msg);
            }
            else
            {
                console.log(msg);
            }
        }
    }
    $.fn[btcombotree] = function (options, param) {
        var defaults={
            defaultLable : '请选择列表',//默认按钮上的文本
            showIcon: true,//显示图标
            maxItemsDisplay : 3,//按钮上最多显示多少项，如果超出这个数目，将会以‘XX项已被选中代替’
            selectToCheck : true,
            onCheck : function (node) {//树形菜单被选中是 触发事件

            },
            onBeforeCheck : function (node) {
                return true;
            },
            onBeforeUnCheck : function (node) {
                return true;
            },
            onUnCheck : function (node) {

            }
        };
        var _options = options;
        //结果集
        var resultArr = [];
        this.each(function () {
            if(typeof _options === "string")
            {
                var $this = $.data(this, btcombotree);
                if(!$this)
                {
                    log("对象未初始化", "error");
                    return;
                }
                else
                {
                    if(!$.isFunction($this[_options]) || _options.charAt(0) === '_')
                    {
                        log("找不到" + _options + "方法");
                        return;
                    }
                }
                resultArr.push($this[_options](param));
            }
            else
            {
                var options = $.extend(defaults, _options);
                $.data(this, btcombotree, new combotree(this, options));
            }    
        });
        if(typeof _options === "string")
        {
            return resultArr;
        }
        //提供链式调用
        return this;
    }
})(jQuery);
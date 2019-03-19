/**
 * Created by CherryDream on 2016/8/25.
 */
(function ($, window, document, undefined) {
    $.fn.bootstrapCombotree = function (options, args) {
        var result;
        //this表示该插件的Jquery对象
        this.each(function () {
            var _this = $.data(this, bootstrapCombotree);
            if(typeof options === 'string')
            {
                if (!_this) {
                    console.error('没有初始化，不能执行该方法 : ' + options);
                }
                else if (!$.isFunction(_this.prototype[options]) || options.charAt(0) === '_') {
                    console.error('没有该方法 : ' + options);
                }
                else {
                    if (!(args instanceof Array)) {
                        args = [ args ];
                    }
                    result = $.fn.bootstrapCombotree.method[options](this, param);
                }
            }
            else if(typeof options === 'boolean')
            {
                console.error("参数必须是对象");
            }
            else
            {
                $.data(this,  new bootstrapCombotree(this, $.extend(true, {}, options)));
            }
        });
        return result;
    };
    var bootstrapCombotree = function (element, options) {
        this.$element = $(element);
        this.Text = new Array() ;//按钮上的文本
        this.Value = new Array();//值
        this.options = options;
        this.init(options);
        return {
            options: options,
            init: $.proxy(this.init, this),
            getValue : $.proxy(this.getValue, this),
            setValue : $.proxy(this.setValue, this),
            setCheck : $.proxy(this.setCheck, this),
        }
    };
    /**
     * 初始化bootstrapCombotree对象
     */
    bootstrapCombotree.prototype = {
        Tree : undefined,
        Button : undefined,
        hidden : undefined,
        init : function(options)
        {
            //写html标签
            if(options.width == undefined)
            {
                this.$element[0].innerHTML = '<div class="btn-group">'
                    + '<button type="button" class="btn btn-default dropdown-toggle"   data-toggle="dropdown" title=' + options.defaultLable +'>'
                    + options.defaultLable + '<span class="caret"></span>'
                    + '</button>'
                    + '<input type="hidden" name="' + options.name + '"/> '
                    + '<div class="dropdown-menu" style="width: 400%"></div>'
                    + '</div>';
            }
            else
            {
                this.$element[0].innerHTML = '<div class="btn-group">'
                    + '<button type="button" class="btn btn-default dropdown-toggle"  data-toggle="dropdown" title=' + options.defaultLable +'>'
                    + options.defaultLable + '<span class="caret"></span>'
                    + '</button>'
                    + '<input type="hidden" name="' + options.name + '"/> '
                    + '<div class="dropdown-menu" style="width: ' + options.width+ 'px;"></div>'
                    + '</div>';
            }
            this.Tree = this.$element.find(".dropdown-menu");//Tree对象
            this.Button = this.$element.find("button");//button对象
            this.hidden = this.$element.find("input[type='hidden']");//隐藏域
            var _this = this;
            //渲染bootstrap-treeview
            this.Tree.treeview({
                data : options.data,
                showIcon: options.showIcon,
                showCheckbox : options.showCheckbox,
                onNodeChecked: function(event, node) {
                    _this.setCheck(node);
                    _this.setCheckparent(node);
                    if(_this.Text.length <= options.maxItemsDisplay)
                    {
                        _this.Button[0].innerHTML = _this.Text + '<span class="caret"></span>';
                        _this.Button.attr("title", _this.Text);
                    }
                    else
                    {
                        _this.Button[0].innerHTML = _this.Text.length  + '项被选中  <span class="caret"></span>';
                        _this.Button.attr("title", _this.Text.length  + '项被选中');
                    }
                    _this.hidden.val(_this.Value);
                    if(options.onCheck != undefined)
                    {
                        options.onCheck(node);
                    }
                },
                onNodeUnchecked: function (event, node) {
                    _this.setUnCheck(node);
                    _this.setunCheckparent(node);
                    if (_this.Text.length == 0) {
                        _this.Button[0].innerHTML = options.defaultLable + '<span class="caret"></span>';
                        _this.Button.attr("title", options.defaultLable);
                    }
                    else {
                        if (_this.Text.length <= options.maxItemsDisplay) {
                            _this.Button[0].innerHTML = _this.Text + '<span class="caret"></span>';
                            _this.Button.attr("title", _this.Text);
                        }
                        else {
                            _this.Button[0].innerHTML = _this.Text.length + '项被选中 <span class="caret"></span>';
                            _this.Button.attr("title",  _this.Text.length + '项被选中');
                        }
                    }
                    _this.hidden.val(_this.Value);
                    if(options.onAfterUnCheck != null)
                    {
                        options.onAfterUnCheck(node);
                    }
                },
                onNodeCollapsed : function (event, node) {

                },
                onNodeExpanded : function (event, node) {
                },
                onNodeSelected: function(event, node) {
                },
                onNodeUnselected: function (event, node) {
                }
            });
            //绑定点击事件
            var dropclick = false;
            // 2016-08-24 此时返回false可以阻止下拉框被隐藏
            // 2016=08-25 此问题解决
            $(this.$element).on('hide.bs.dropdown', function (e) {
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
            this.Tree.on('click', function () {
                dropclick = true;
            })
        },

        setValue : function (nodes) {
            var arr = nodes.split(",");
            for(var i = 0; i < arr.length; i++)
            {
                    this.setCheck(arr[i]);
                    this.setCheckparent(arr[i]);
            }
            if(this.Text.length <= this.options.maxItemsDisplay)
            {
                this.Button[0].innerHTML = this.Text + '<span class="caret"></span>';
                this.Button.attr("title", this.Text);
            }
            else
            {
                this.Button[0].innerHTML = this.Text.length  + '项被选中  <span class="caret"></span>';
                this.Button.attr("title", this.Text.length  + '项被选中');
            }
            this.hidden.val(this.Value);
        };

        $.fn.bootstrapCombotree.method = {
        getValue : function () {
           console.log(this);
        }
    }
        /**
         * 选定节点及其子节点,并将值赋予值域
         * @param node 节点
         * @param $Button 组件的button按钮，修改时无需修改此处
         * @param $hidden 组件的值域，修改时无需修改此处
         * @param defaultText 组件的按钮默认文字，修改时无需修改此处
         */
        setCheck : function (node) {
            this.Tree.treeview('checkNode', [ this.Tree.treeview('getNode', [ node.nodeId, { ignoreCase: true, exactMatch: false }]), { silent: true}]);
            if(this.Button[0].innerText == this.options.defaultText)
            {
                this.Button[0].innerText = '';
            }
            if(node == undefined)
            {
                return;
            }
            else
            {

                if(node.nodes == undefined)
                {
                    if($.inArray(node.id, this.Value) < 0)
                    {
                        this.Value.push(node.id);
                        this.Text.push(node.text);
                    }
                }
                else
                {

                    for(var i = 0; i < node.nodes.length; i++)
                    {
                        this.setCheck(node.nodes[i]);
                    }
                }
            }
        },

        /**
         * 选择父节点
         * @param node
         * @param $Tree
         */
        setCheckparent : function (node) {
            if(node.parentId == undefined)
            {
                return;
            }
            var pNode = this.Tree.treeview('getNode', [ node.parentId, { ignoreCase: true, exactMatch: false } ]);
            this.Tree.treeview('checkNode', [ pNode, { silent: true}]);
            this.setCheckparent(pNode);
        },

        /**
         * 取消选定节点及其子节点,并将值从值域中取出
         * @param node 节点
         * @param $Button 组件的button按钮，修改时无需修改此处
         * @param $hidden 组件的值域，修改时无需修改此处
         * @param defaultText 组件的按钮默认文字，修改时无需修改此处
         */
        setUnCheck : function (node) {
            this.Tree.treeview('uncheckNode', [ this.Tree.treeview('searchById', [ node.id, { ignoreCase: true, exactMatch: false } ]), { silent: true}]);
            if(node == undefined)
            {
                return;
            }
            else
            {
                if(node.nodes == undefined)
                {
                    for(var i = 0; i < this.Value.length; i++)
                    {
                        if (this.Text[i] == node.text) {
                            this.Text.splice(i, 1);
                        }
                        if (this.Value[i] == node.id) {
                            this.Value.splice(i, 1);
                        }
                    }
                }
                else
                {
                    for(var i = 0; i < node.nodes.length; i++)
                    {
                        this.setUnCheck(node.nodes[i]);
                    }
                }
            }
        },

        /**
         * 取消选择父节点
         * @param node
         * @param $Tree
         */
        setunCheckparent : function (node) {
            if (node.parentId == undefined) {
                return;
            }
            var pNode = this.Tree.treeview('getNode', [node.parentId, {ignoreCase: true, exactMatch: false}]);
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
                this.Tree.treeview('uncheckNode', [ pNode, { silent: true}]);
                this.setunCheckparent(pNode);
            }
            else
            {
                return;
            }
        }
    }






})(jQuery, window, document);
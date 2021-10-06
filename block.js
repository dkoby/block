/*
 * 2020-2021 Dmitrij Kobilin.
 *
 * Nenia rajtigilo ekzistas.
 * Faru bone, ne faru malbone.
 *
 */
"use strict";

var BlockElement = function(tagName, classList, htmlParentElement, innerHTML, events, blockParent) {
    this.element = document.createElement(tagName ? tagName : "div");

    this.blockParent = blockParent;

    if (htmlParentElement)
    {
        htmlParentElement.appendChild(this.element);
        this.htmlParentElement = htmlParentElement;
    }

    let opt = {
        classList: classList,
        innerHTML: innerHTML,
        events: events,
    }

    this.mutate(opt);
}
BlockElement.prototype.mkChild = function(tagName, classList, innerHTML, events) {
    if (Object.getPrototypeOf(this).constructor === BlockElementExt)
    {
        return this.mkChildExt({
            tagName: tagName,
            classList: classList,
            innerHTML: innerHTML,
            events: events,
        });
    } else {
        return new this.constructor(tagName, classList, this.element, innerHTML, events, this);
    }
}
BlockElement.prototype.addChild = function(block) {
    this.element.appendChild(block.element);
    return this;
}
BlockElement.prototype.mkChildOf = function(n, tagName, classList, innerHTML, events) {
    let blockParent = this;
    while (--n)
        blockParent = blockParent.getParent();
    return blockParent.mkChild(tagName, classList, innerHTML, events);
}
BlockElement.prototype.mkSibling = function(tagName, classList, innerHTML, events) {
    return this.getParent().mkChild(tagName, classList, innerHTML, events);
}
BlockElement.prototype.getParent = function(n) {
    if (n === undefined)
        return this.blockParent;

    let blockParent = this;
    while (n--)
        blockParent = blockParent.getParent();
    return blockParent;
}
BlockElement.prototype.getParentN = function(n) {
    return this.getParent(n);
}
BlockElement.prototype.applyArray = function(array, iterator) {
    if (array && iterator)
        array.forEach(iterator.bind(this, this));
    return this;
}
BlockElement.prototype.applyIndex = function(n, iterator) {
    if (n > 0 && iterator)
    {
        for (let index = 0; index < n; index++)
            iterator.call(this, this, index);
    }
    return this;
}
BlockElement.prototype.apply = function(apply) {
    apply.call(this, this);
    return this;
}
BlockElement.prototype.mutate = function(opt) {
    opt = opt || {};

    if (opt.classListRemove)
    {
        opt.classListRemove.forEach((c) => {
            this.element.classList.remove(c);
        });
    }
    if (opt.classList)
    {
        opt.classList.forEach((c) => {
            this.element.classList.add(c);
        });
    }

    if (opt.innerHTML !== undefined && opt.innerHTML !== null)
        this.innerHTML = opt.innerHTML;

    if (opt.attrs)
    {
        Object.keys(opt.attrs).forEach((key) => {
            this.element.setAttribute(key, opt.attrs[key]); 
        });
    }
    if (opt.element)
    {
        Object.keys(opt.element).forEach((key) => {
            this.element[key] = opt.element[key]; 
        });
    }
    if (opt.events)
    {
        Object.keys(opt.events).forEach((key) => {
            this.element.addEventListener(key, opt.events[key]); 
        });
    }
    if (opt.style)
    {
        Object.keys(opt.style).forEach((key) => {
            this.element.style[key] = opt.style[key];
        });
    }
    if (opt.value)
        this.element.value = value;
    return this;
}
BlockElement.prototype.shown = function() {
    return this.element.style["display"] != "none";
}
BlockElement.prototype.hide = function(visibility) {
    if (visibility)
        this.element.style["visibility"] = "hidden";
    else
        this.element.style["display"] = "none";
    return this;
}
BlockElement.prototype.show = function(visibility) {
    if (visibility)
        this.element.style["visibility"] = "";
    else
        this.element.style["display"] = "";
    return this;
}
BlockElement.prototype.toggle = function() {
    if (this.shown())
        this.hide();
    else
        this.show();
    return this;
}
BlockElement.prototype.disable = function() {
    this.element.setAttribute("disabled", "");
    return this;
}
BlockElement.prototype.enable = function() {
    this.element.removeAttribute("disabled");
    return this;
}
BlockElement.prototype.addClass = function(value) {
    this.element.classList.add(value);
    return this;
}
BlockElement.prototype.removeClass = function(value) {
    this.element.classList.remove(value);
    return this;
}
BlockElement.prototype.setValue = function(value, ref) {
    this.element.value = value;
    return this;
}
if (true)
{
    let controls = [
        {type: "innerHTML"    , write: true },
        {type: "value"        , write: true },
        {type: "classList"    , write: false},
        {type: "checked"      , write: true },
        {type: "selected"     , write: true },
        {type: "style"        , write: false},
        {type: "selectedIndex", write: true },
    ]
    controls.forEach((control) => {
        let prop = {};
        prop.get = function() {
            return this.element[control.type];
        };
        if (control.write)
        {
            prop.set = function(value) {
                this.element[control.type] = value;
            };
        }
        Object.defineProperty(BlockElement.prototype, control.type, prop);
    });
}
BlockElement.prototype.destroy = function() {
    if (this.destroyed)
        return;
    if (this.htmlParentElement && this.htmlParentElement.contains(this.element))
        this.htmlParentElement.removeChild(this.element);

    this.destroyed = true;
    return this;
}
BlockElement.prototype.addEvent = function(eventName, command) {
    this.element.addEventListener(eventName, command);
    return this;
}
BlockElement.prototype.mkChildExt = function(opt) {
    opt.htmlParentElement = this.element;
    opt.blockParent = this;
    return new BlockElementExt(opt);
}
BlockElement.prototype.mkSiblingExt = function(opt) {
    return this.getParent().mkChildExt(opt);
}
var BlockElementExt = function(opt) {
    this.opt = opt;

    BlockElement.call(this,
            opt.tagName,
            opt.classList,
            opt.htmlParentElement,
            opt.innerHTML,
            opt.events,
            opt.blockParent);

    this.mutate(opt);
}
BlockElementExt.prototype = Object.create(BlockElement.prototype);
BlockElementExt.prototype.constructor = BlockElementExt;


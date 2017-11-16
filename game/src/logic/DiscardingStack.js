
/**
 * A stack for int values that normally needs a limited buffer size, but which accepts
 * unlimited number of elements. To do this, the user code can grant permission
 * to discard old entries. With such a permission given, subsequent put operations
 * may auto-delete the oldest element to keep stack size small.
 * In such a case the size of the stack will not grow.
 */
var DiscardingStack = function() 
{
    capacity = 0;           // size if the data array
    elements = null;            // the data is put into the buffer in round-robin manner
    offset = 0;             // position inside the array where the bottom-most stack element lies 
    length = 0;             // length of "active" part of the array - may wrap around the border
    destroypermission = 0;  // permission was given to auto-discard this many elements
};

    /**
     * Create new auto-discarding stack.
     * @capacity Initial capacity. In certain cases the capacity will be
     * automatically increased. Since this is an expensive operation, try to choose the
     * value in a way that it should never be exhausted in normal use.
     */
DiscardingStack.prototype.$ = function(capacity)
{
        this.capacity = capacity;
        this.elements = new Array(capacity);
        this.offset = 0;
        this.length = 0;
        this.destroypermission = 0;
};
    
    /** 
     * Completely clears the stack.
     */
DiscardingStack.prototype.clear = function()
{
    this.offset = 0;
    this.length = 0;
    this.destroypermission = 0;
};

    /** 
     * Add a new value to the stack. When the increased size exceeds the current capacity, 
     * the capacity will be automatically increased also.
     * When a prior permission was given to discard old elements this is done and the new value
     * will be stored on top of the stack without the increasing its size.
     * @param value The value to push on top of the stack.
     */
DiscardingStack.prototype.push = function(value)
{
    if (this.length>=this.capacity)
    {   // must do something since buffer is full
        if (this.destroypermission > 0)
        {   // if not necessary to keep all data, can discard and overwrite the oldest element
            this.destroypermission--;
            this.elements[this.offset] = value;
            this.offset = (this.offset+1) % capacity;
            return;
        }
        else
        {   // expand capacity to hold more data
            var b2 = new Array(capacity*2);            
                // the content is in 2 parts, the second beginning at "offset" - compact the array
                // System.arraycopy(elements,offset, b2,0, capacity-offset);
            for (var i=0; i<capacity-offset; i++) b2[i] = this.elements[offset+i];            
                // System.arraycopy(elements,0, b2,capacity-offset, offset);
            for (var i=0; i<offset; i++) b2[capacity-offset+i] = this.elements[i];            
            this.offset = 0;
            this.elements = b2;
            this.capacity = this.capacity*2;
        }
    }
    // insert element at top of stack
    this.elements[(this.offset+this.length)%this.capacity] = value;
    this.length++;        
};

    /**
     * Give the stack the permission to discard the the bottom-most values on the
     * stack.
     * @param number How many elements (from current point of view) may be auto-destroyed.
     *   When auto-discard is later performed the number is also decremented then to
     *   not destroy too many elements.
     *   The permission may later be changed any time.
     *   It is even possible to allow discarding elements that are not yet generated.
     */
DiscardingStack.prototype.mayDiscard = function(number)
{
    this.destroypermission = number;
};
    
    /** 
     * Extract the topmost element. 
     * @return The element previously on top of stack or 0 of none exists.
     */
DiscardingStack.prototype.pop = function()
{
        if (this.length<=0)
        {   return 0;
        }
        else
        {   this.length--;
            return this.elements[(this.offset+this.length)%this.capacity];
        }
};

    /** 
     * Query the number of elements on the stack.
     */
DiscardingStack.prototype.size = function()
{
    return this.length;
};
    
    /** 
     * Query the number of elements in the "save" area , that means, the elements
     * for which there was not given a permission to discard. 
     */
DiscardinStack.prototype.keepingSize = function()
{
    return this.length - this.destroypermission;
};
    
DiscardingStack.prototype.capacity = function()
{   
    return this.capacity;
};

    /**
     * Retrieve the element at the position on the stack.
     * @return The element on the position, or 0 if index is out of bounds
     *  index >= 0 && index < size()
     */
DiscardingStack.prototype.get = function(index)
{
        if (index<0 || index>=this.length) 
        {   return 0;
        }
        else
        {   return this.elements[(this.offset+this.index)%this.capacity];
        }
};

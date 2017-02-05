package grafl.sy.logic;

/**
 * A stack for int values that normally needs a limited buffer size, but which accepts
 * unlimited number of elements. To do this, the user code can grant permission
 * to discard old entries. With such a permission given, subsequent put operations
 * may auto-delete the oldest element to keep stack size small.
 * In such a case the size of the stack will not grow.
 * Implementation is not thread-save.
 * @author Reinhard
 */
public class DiscardingStack
{
	int capacity;           // size if the data array
	int[] elements;			// the data is put into the buffer in round-robin manner
	int offset;             // position inside the array where the bottom-most stack element lies 
	int length;             // length of "active" part of the array - may wrap around the border
	int destroypermission;  // permission was given to auto-discard this many elements
	
	/**
	 * Create new auto-discarding stack.
	 * @capacity Initial capacity. In certain cases the capacity will be
	 * automatically increased. Since this is an expensive operation, try to choose the
	 * value in a way that it should never be exhausted in normal use.
	 */
	public DiscardingStack(int capacity)
	{
		this.capacity = capacity;
		this.elements = new int[capacity];
		this.offset = 0;
		this.length = 0;
		this.destroypermission = 0;
	}
	
	/** 
	 * Completely clears the stack.
	 */
	public void clear()
	{
		offset = 0;
		length = 0;
		destroypermission = 0;
	}

	/** 
	 * Add a new value to the stack. When the increased size exceeds the current capacity, 
	 * the capacity will be automatically increased also.
	 * When a prior permission was given to discard old elements this is done and the new value
	 * will be stored on top of the stack without the increasing its size.
	 * @param value The value to push on top of the stack.
	 */
	public void push(int value)
	{
		if (length>=capacity)
		{	// must do something since buffer is full
			if (destroypermission > 0)
			{	// if not necessary to keep all data, can discard and overwrite the oldest element
				destroypermission--;
				elements[offset] = value;
				offset = (offset+1) % capacity;
				return;
			}
			else
			{	// expand capacity to hold more data
				int[] b2 = new int[capacity*2];
				// the content is in 2 parts, the second beginning at "offset" - compact the array
				System.arraycopy(elements,offset, b2,0, capacity-offset);
				System.arraycopy(elements,0, b2,capacity-offset, offset);
				offset = 0;
				elements = b2;
				capacity = capacity*2;
			}
		}
		// insert element at top of stack
		elements[(offset+length)%capacity] = value;
		length++;
		
	}

	/**
	 * Give the stack the permission to discard the the bottom-most values on the
	 * stack.
	 * @param number How many elements (from current point of view) may be auto-destroyed.
	 *   When auto-discard is later performed the number is also decremented then to
	 *   not destroy too many elements.
	 *   The permission may later be changed any time.
	 *   It is even possible to allow discarding elements that are not yet generated.
	 */
	public void mayDiscard(int number)
	{
		destroypermission = number;
	}
	
	/** 
	 * Extract the topmost element. 
	 * @return The element previously on top of stack or 0 of none exists.
	 */
	public int pop()
	{
		if (length<=0)
		{	return 0;
		}
		else
		{	length--;
			return elements[(offset+length)%capacity];
		}
	}

	/** 
	 * Query the number of elements on the stack.
	 */
	public int size()
	{
		return length;
	}
	
	/** 
	 * Query the number of elements in the "save" area , that means, the elements
	 * for which there was not given a permission to discard. 
	 */
	public int keepingSize()
	{
		return length - destroypermission;
	}
	
	public int capacity()
	{	
		return capacity;
	}

	/**
	 * Retrieve the element at the position on the stack.
	 * @return The element on the position, or 0 if index is out of bounds
	 *  index >= 0 && index < size()
	 */
	public int get(int index)
	{
		if (index<0 || index>=length) 
		{	return 0;
		}
		else
		{	return elements[(offset+index)%capacity];
		}
	}
}

package grafl.sy.logic;

import static org.junit.Assert.*;
import org.junit.Test; 

public class DiscardingStackTest 
{
	@Test
	public void testAutogrow()
	{
		DiscardingStack d = new DiscardingStack(3);
		d.push(5);   // p 0
		d.push(2);   // p 1
		assertEquals(2, d.size());
		assertEquals(5, d.get(0));
		assertEquals(2, d.get(1));
		int x = d.pop();
		assertEquals(2, x);
		assertEquals(1, d.size());
		d.push(99);   // p 1
		assertEquals(2, d.size());
		d.push(110);  // p 2
		assertEquals(3, d.size());
		d.push(47);   // p 3
		assertEquals(6, d.capacity());
		assertEquals(47, d.get(3));
		assertEquals(0, d.get(99));
	}

	@Test
	public void testDicarding()
	{
		DiscardingStack d = new DiscardingStack(5);
		d.push(90);   // p 0
		d.push(91);   // p 1
		d.push(92);   // p 2
		d.mayDiscard(3);
		d.push(93);   // p 3
		d.push(94);   // p 4
		assertEquals(5, d.size());
		d.push(95);   // p 4 (discarding 0)
		d.push(96);   // p 4 (discarding 0)
		d.push(97);   // p 4 (discarding 0)
		assertEquals(97, d.get(4));
		assertEquals(96, d.get(3));
		assertEquals(95, d.get(2));
		assertEquals(94, d.get(1));
		assertEquals(93, d.get(0));
		d.pop();
		d.pop();
		assertEquals(3, d.size());
		assertEquals(95, d.get(2));
		assertEquals(94, d.get(1));
		assertEquals(93, d.get(0));
	}

	@Test
	public void testGrowAfterDicarding()
	{
		DiscardingStack d = new DiscardingStack(5);
		d.push(90);   // p 0
		d.push(91);   // p 1
		d.push(92);   // p 2
		d.push(93);   // p 3
		d.push(94);   // p 4
		assertEquals(5, d.size());
		d.mayDiscard(2);
		d.push(95);   // p 4
		assertEquals(95, d.get(4));
		assertEquals(5, d.size());
		d.push(96);   // p 4

		assertEquals(5, d.size());
		assertEquals(5, d.capacity());
		assertEquals(92, d.get(0));
		assertEquals(93, d.get(1));
		assertEquals(94, d.get(2));
		assertEquals(95, d.get(3));
		assertEquals(96, d.get(4));
		
		d.push(97);   // p 5
		assertEquals(6, d.size());
		assertEquals(10, d.capacity());
		d.push(98);   // p 6
		assertEquals(7, d.size());
		assertEquals(10, d.capacity());
		d.push(99);   // p 7
		assertEquals(8, d.size());
		assertEquals(10, d.capacity());
		
		assertEquals(92, d.get(0));
		assertEquals(93, d.get(1));
		assertEquals(94, d.get(2));
		assertEquals(95, d.get(3));
		assertEquals(96, d.get(4));
		assertEquals(97, d.get(5));
		assertEquals(98, d.get(6));
		assertEquals(99, d.get(7));
	}
	
}

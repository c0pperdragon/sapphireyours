package grafl.sy.renderer;

import static org.junit.Assert.*; 
import org.junit.Test; 

public class FreespaceManagerTest
{
	FreespaceManager fsm;
	
	@Test
	public void testAllocation() 
	{
		fsm = new FreespaceManager(45,40);
		alloc(0,0, 10,10);		
		alloc(0,10, 10,10);		
		alloc(0,20, 10,10);		
		alloc(0,30, 10,10);		
		alloc(10,0, 10,10);		
		alloc(10,10, 5,15);		
		alloc(20,0, 8,8);		
		alloc(28,0, 10,10);		
		alloc(15,10, 20,20);		

		fsm.allocateArea(10,10);		
		fsm.allocateArea(10,10);		
		fsm.allocateArea(10,10);		
		fsm.allocateArea(10,10);		
		fsm.allocateArea(10,10);		
		System.out.println ("Usage: "+fsm.calculateUsage());
	}
	
	private void alloc(int x, int y, int w, int h)
	{
		int[] area = fsm.allocateArea(w,h);
		assertArrayEquals (new int[]{x,y,w,h}, area);
	} 	
	

}

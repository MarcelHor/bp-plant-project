import time
from grove.adc import ADC
from grove.gpio import GPIO

__all__ = ['GroveLedBar', 'GroveMoistureSensor', 'GroveWaterSensor']

class GroveLedBar(object):
    '''
    Class for Grove - LED Bar

    Args:
        pin(int): number of digital pin the led bar connected.
        reverse: sets the led bar direction for level values. default False.
    '''
    def __init__(self, pin, reverse=False):
        self._dio = GPIO(pin, direction=GPIO.OUT)
        self._clk = GPIO(pin + 1, direction=GPIO.OUT)
        self._reverse = reverse
        self._clk_data = 0

    def __del__(self):
        self.level(0)
        self._dio.write(0)
        self._clk.write(0)

    @property
    def reverse(self):
        '''
        led bar direction for level values.
        '''
        return self._reverse
    
    @reverse.setter
    def reverse(self, value: bool):
        if type(value) is not bool:
            raise TypeError('reverse must be bool')
        self._reverse = value

    def level(self, value, brightness=255):
        '''
        select a level to light the led bar.
        value: number of level, 0 - 10.
        brightness:
            8-bit grayscale mode: 0 - 127 (128 - 255)
        '''
        # print('level:{0:2} ['.format(value), end='')
        self._begin()
        for i in range(9,-1,-1) if self._reverse else range(10):
            self._write16(brightness if value > i else 0)
            # print('{0}:{1:3}'.format(i, brightness if value > i else 0), end=', ')
        self._end()
        # print(']')

    def bits(self, val, brightness=255):
        val &= 0x3FF
        self._begin()
        for i in range(9,-1,-1) if self._reverse else range(10):
            self._write16(brightness if (val >> i) & 1 else 0)
        self._end()

    def bytes(self, buf):
        self._begin()
        for i in range(9,-1,-1) if self._reverse else range(10):
            self._write16(buf[i])
        self._end()

    def _begin(self):
        self._write16(0)    # 8-bit grayscale mode

    def _end(self):
        '''
        fill to 208-bit shift register
        '''
        self._write16(0)
        self._write16(0)
        self._latch()


    def _send_clock(self):
        self._clk_data = abs(self._clk_data - 1)
        self._clk.write(self._clk_data)

    def _write16(self, data):
        for i in range(15, -1, -1):
            self._dio.write((data >> i) & 1)
            self._send_clock()

    def _latch(self):
        '''
        Internal-latch control cycle
        '''
        self._dio.write(0)
        self._send_clock()  # keeping DCKI level
        time.sleep(.00022)  # Tstart: >220us

        for i in range(4):  # Send 4 DI pulses
            self._dio.write(1)
            time.sleep(.00000007)    # twH: >70ns
            self._dio.write(0)
            time.sleep(.00000023)    # twL: >230ns

        time.sleep(.0000002)    # Tstop: >200ns (not supported cascade)


class GroveMoistureSensor:
    def __init__(self, channel, min_value=590, max_value=330):
        self.min_value = min_value  
        self.max_value = max_value
        self.channel = channel
        self.adc = ADC()

    def readRaw(self):
        return self.adc.read(self.channel)

    def read(self):
        value = self.adc.read(self.channel)
        percentage = ((self.min_value - value) / (self.min_value - self.max_value)) * 100
        return max(0, min(100, percentage))


class GroveWaterSensor:
    def __init__(self, channel, wet_threshold=20):
        self.wet_threshold = wet_threshold
        self.channel = channel
        self.adc = ADC()

    def readRaw(self):
        return self.adc.read(self.channel)

    def read(self):
        value = self.adc.read(self.channel)
        print(value)
        if value <= self.wet_threshold:  
            return 100
        else:
            return 0




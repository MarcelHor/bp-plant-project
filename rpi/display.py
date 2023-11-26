import time
import smbus
import RPi.GPIO as GPIO


class Display:
    DISPLAY_TEXT_ADDR = 0x3e  # i2c address of text display

    def __init__(self):
        '''
        Initialize display
        '''
        rev = GPIO.RPI_REVISION
        if rev == 2 or rev == 3:
            self.bus = smbus.SMBus(1)
        else:
            self.bus = smbus.SMBus(0)

    def textCommand(self, cmd):
        '''
        Send text command to display
        :param cmd: command to send
        '''
        self.bus.write_byte_data(self.DISPLAY_TEXT_ADDR, 0x80, cmd)

    def clear(self):
        '''
        Clear display and set cursor to home position
        '''
        self.textCommand(0x01)

    def setText(self, text):
        '''
        Set text to display and clear the display first
        :param text: text to display
        '''
        self.textCommand(0x01)  # clear display
        time.sleep(.05)
        self.textCommand(0x08 | 0x04)  # display on, no cursor
        self.textCommand(0x28)  # 2 lines
        time.sleep(.05)
        count = 0
        row = 0
        for c in text:
            if c == '\n' or count == 16:
                count = 0
                row += 1
                if row == 2:
                    break
                self.textCommand(0xc0)
                if c == '\n':
                    continue
            count += 1
            self.bus.write_byte_data(self.DISPLAY_TEXT_ADDR, 0x40, ord(c))

    def setText_norefresh(self, text):
        '''
        Set text without clearing the display
        :param text: text to display
        '''
        self.textCommand(0x02)  # return home
        time.sleep(.05)
        self.textCommand(0x08 | 0x04)  # display on, no cursor
        self.textCommand(0x28)  # 2 lines
        time.sleep(.05)
        count = 0
        row = 0
        while len(text) < 32:  # clears the rest of the screen
            text += ' '
        for c in text:
            if c == '\n' or count == 16:
                count = 0
                row += 1
                if row == 2:
                    break
                self.textCommand(0xc0)
                if c == '\n':
                    continue
            count += 1
            self.bus.write_byte_data(self.DISPLAY_TEXT_ADDR, 0x40, ord(c))

    def create_char(self, location, pattern):
        """
           Writes a bit pattern to LCD CGRAM

           Arguments:
           location -- integer, one of 8 slots (0-7)
           pattern -- byte array containing the bit pattern, like as found at
                      https://omerk.github.io/lcdchargen/
           """
        location &= 0x07  # Make sure location is 0-7
        self.textCommand(0x40 | (location << 3))
        self.bus.write_i2c_block_data(self.DISPLAY_TEXT_ADDR, 0x40, pattern)

import time
import smbus
import RPi.GPIO as GPIO


class Display:
    DISPLAY_TEXT_ADDR = 0x3e

    def __init__(self):
        rev = GPIO.RPI_REVISION
        if rev == 2 or rev == 3:
            self.bus = smbus.SMBus(1)
        else:
            self.bus = smbus.SMBus(0)

    def textCommand(self, cmd):
        self.bus.write_byte_data(self.DISPLAY_TEXT_ADDR, 0x80, cmd)

    def clear(self):
        self.textCommand(0x01)

    # set display text \n for second line(or auto wrap)
    def setText(self, text):
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

    # Update the display without erasing the display
    def setText_norefresh(self, text):
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

    # Create a custom character (from array of row patterns)
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


# Hlavní funkce
def main():
    display = Display()
    display.setText("Hello World!")
    time.sleep(3)
    display.setText("Goodbye World!")


if __name__ == '__main__':
    main()
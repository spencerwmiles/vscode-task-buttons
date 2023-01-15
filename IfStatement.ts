import * as cp from "child_process";


class IfCondition {
    condition: string | number | boolean;
    terminal: boolean = false;

    constructor(condition: string | number | boolean) {
        this.terminal = true;
        this.condition = condition;

        if(typeof condition == "string") {
            const regex = /^{.+}$/g
            const isTerminal = new RegExp(regex);

            this.terminal = isTerminal.test(condition);

            if(this.terminal) {
                this.condition = condition.slice(1, -1);
            }
        }        
    }

    private async shell (cmd: string) {
        const command = `${cmd}`;

        return await cp.exec(command, (err, out) => {
            if(err) {
                return false;
            }

            return out;
        });
    }

    async val() {
        if(this.terminal) {
            return await this.shell(this.condition.toString());
        }

        return this.condition;
    }
}

class IfOperator {
    expression;

    constructor(operator: string) {
        switch(operator) {
        case '>=':
            this.expression = this.lessThanAndEquals;
            break;
        case '>':
            this.expression = this.lessThan;
            break;
        case '<=':
            this.expression = this.greaterThanAndEquals;
            break;
        case '<':
            this.expression = this.greaterThan;
            break;
        case '!==':
            this.expression = this.notEqualsStrict;
            break;
        case '!=':
            this.expression = this.notEquals;
            break;
        case '===':
            this.expression = this.equalsStrict;
            break;
        case '==':
        default:
            this.expression = this.equals;
            break;
        }
    }

    private equals($a:IfCondition, $b:IfCondition) {
        return $a.val() == $b.val();
    }

    private equalsStrict($a:IfCondition, $b:IfCondition) {
        return $a.val() === $b.val();
    }

    private notEquals($a:IfCondition, $b:IfCondition) {
        return $a.val() != $b.val();
    }

    private notEqualsStrict($a:IfCondition, $b:IfCondition) {
        return $a.val() !== $b.val();
    }

    private greaterThan($a:IfCondition, $b:IfCondition) {
        return $a.val() < $b.val();
    }

    private greaterThanAndEquals($a:IfCondition, $b:IfCondition) {
        return $a.val() <= $b.val();
    }

    private lessThan($a:IfCondition, $b:IfCondition) {
        return $a.val() > $b.val();
    }

    private lessThanAndEquals($a:IfCondition, $b:IfCondition) {
        return $a.val() >= $b.val();
    }
}


class IfStatement {
    private condition: IfCondition;
    private operator: IfOperator;
    private value: IfCondition;
    
    constructor(condition: string | number | boolean, value: string | number | boolean, operator: string = '==') {
        this.condition = new IfCondition(condition);
        this.operator = new IfOperator(operator);
        this.value = new IfCondition(value);
    }

    check() {
        return this.operator.expression(this.condition, this.value);
    }
}

export default IfStatement;